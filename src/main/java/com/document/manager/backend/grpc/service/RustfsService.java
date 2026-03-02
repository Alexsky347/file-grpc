package com.document.manager.backend.grpc.service;

import com.document.manager.backend.grpc.config.GrpcConfig;
import com.document.manager.backend.grpc.dto.FileInfoDto;
import com.document.manager.backend.grpc.exception.CustomRunTimeException;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import io.quarkus.runtime.StartupEvent;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.core.Vertx;
import jakarta.annotation.Nullable;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
@Slf4j
public class RustfsService {

    @Getter
    private final String rustfsUrl;
    @Getter
    private final String bucket;

    private final Vertx vertx;
    private final String accessKey;
    private final String secretKey;
    private final int presignedUrlExpiry;
    // MinIO SDK is used as a generic S3 client — fully compatible with RustFS
    private MinioClient s3Client;

    @Inject
    RustfsService(final Vertx vertx, final GrpcConfig grpcConfig) {
        this.vertx = vertx;
        this.rustfsUrl = grpcConfig.rustfs().url();
        this.accessKey = grpcConfig.rustfs().accessKey();
        this.secretKey = grpcConfig.rustfs().secretKey();
        this.bucket = grpcConfig.rustfs().bucket();
        this.presignedUrlExpiry = grpcConfig.rustfs().presignedUrlExpiry().orElse(3600);
    }

    /**
     * Extract original filename from object name.
     * Format is: username/uuid-filename
     */
    private static String extractFilenameFromObjectName(final String objectName) {
        final String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        final int dashIndex = nameWithUuid.indexOf('-', 36); // UUID is 36 chars
        if (dashIndex >= 0 && dashIndex < nameWithUuid.length() - 1) {
            return nameWithUuid.substring(dashIndex + 1);
        }
        return nameWithUuid;
    }

    /**
     * Extract UUID from object name.
     * Format is: username/uuid-filename
     */
    private static String extractUuidFromObjectName(final String objectName) {
        final String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        if (nameWithUuid.length() > 36 && nameWithUuid.charAt(36) == '-') {
            return nameWithUuid.substring(0, 36);
        }
        return null;
    }

    private static String generateObjectName(final String filename, final String username) {
        final String uuid = UUID.randomUUID().toString();
        return username + "/" + uuid + "-" + (StringUtils.isBlank(filename) ? "random" : filename);
    }

    /**
     * Check if filename matches the specified file type filter.
     *
     * @param filename       the filename to check
     * @param fileTypeFilter the filter type: "images", "documents", or "all"
     * @return true if the filename matches the filter
     */
    private static boolean matchesFileType(final String filename, final String fileTypeFilter) {
        final String lowerFilename = filename.toLowerCase();

        return switch (fileTypeFilter.toLowerCase()) {
            case "images" -> lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg") ||
                    lowerFilename.endsWith(".png") || lowerFilename.endsWith(".gif") ||
                    lowerFilename.endsWith(".bmp") || lowerFilename.endsWith(".webp") ||
                    lowerFilename.endsWith(".svg") || lowerFilename.endsWith(".ico");
            case "documents" -> lowerFilename.endsWith(".pdf") || lowerFilename.endsWith(".doc") ||
                    lowerFilename.endsWith(".docx") || lowerFilename.endsWith(".txt") ||
                    lowerFilename.endsWith(".xls") || lowerFilename.endsWith(".xlsx") ||
                    lowerFilename.endsWith(".ppt") || lowerFilename.endsWith(".pptx") ||
                    lowerFilename.endsWith(".odt") || lowerFilename.endsWith(".ods") ||
                    lowerFilename.endsWith(".csv") || lowerFilename.endsWith(".rtf");
            default -> true; // "all" or unknown filter - return all files
        };
    }

    void onStart(@Observes final StartupEvent ev) {
        log.info("Initializing RustFS S3 client");
        this.initS3Client();
        this.createBucketIfNotExists();
    }

    private void initS3Client() {
        this.s3Client = MinioClient.builder()
                .endpoint(this.rustfsUrl)
                .credentials(this.accessKey, this.secretKey)
                .build();
    }

    private void createBucketIfNotExists() {
        try {
            final boolean bucketExists = this.s3Client.bucketExists(BucketExistsArgs.builder().bucket(this.bucket).build());
            if (!bucketExists) {
                log.info("Creating bucket: {}", this.bucket);
                this.s3Client.makeBucket(MakeBucketArgs.builder().bucket(this.bucket).build());
            } else {
                log.info("Bucket already exists: {}", this.bucket);
            }
            // Attempt to set a public-read policy; non-fatal if the server does not support it
            this.setBucketPolicy();
        } catch (final CustomRunTimeException e) {
            // setBucketPolicy already logged a warning — do not rethrow
            log.warn("Continuing without bucket policy (server may not support it)");
        } catch (final Exception e) {
            log.error("Error checking/creating bucket '{}': {}", this.bucket, e.getMessage(), e);
            throw new CustomRunTimeException("Failed to create or access bucket: " + this.bucket, e);
        }
    }

    /**
     * Attempt to set bucket policy to allow public read access.
     * This is best-effort — RustFS and some other S3-compatible stores may not support this API.
     */
    private void setBucketPolicy() {
        try {
            final String policy = "{\n" +
                    "    \"Version\": \"2012-10-17\",\n" +
                    "    \"Statement\": [\n" +
                    "        {\n" +
                    "            \"Effect\": \"Allow\",\n" +
                    "            \"Principal\": \"*\",\n" +
                    "            \"Action\": [\n" +
                    "                \"s3:GetObject\"\n" +
                    "            ],\n" +
                    "            \"Resource\": [\n" +
                    "                \"arn:aws:s3:::" + this.bucket + "/*\"\n" +
                    "            ]\n" +
                    "        }\n" +
                    "    ]\n" +
                    "}";

            this.s3Client.setBucketPolicy(SetBucketPolicyArgs.builder()
                    .bucket(this.bucket)
                    .config(policy)
                    .build());

            log.info("Bucket policy set to public read for bucket: {}", this.bucket);
        } catch (final Exception e) {
            // Non-fatal: log a warning and let the caller decide whether to continue
            log.warn("Could not set bucket policy for '{}' (not supported by this server?): {}", this.bucket, e.getMessage());
            throw new CustomRunTimeException("Failed to set bucket policy", e);
        }
    }

    Uni<String> uploadFile(final byte[] content, final String filename, final String username) {
        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        try {
                            final String objectName = generateObjectName(filename, username);

                            this.s3Client.putObject(PutObjectArgs.builder()
                                    .bucket(this.bucket)
                                    .object(objectName)
                                    .stream(new ByteArrayInputStream(content), content.length, -1)
                                    .build());
                            return objectName;
                        } catch (final Exception e) {
                            log.error("Error uploading file", e);
                            throw new CustomRunTimeException("File upload failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    Uni<Boolean> deleteFile(final String objectName) {
        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        try {
                            this.s3Client.removeObject(RemoveObjectArgs.builder()
                                    .bucket(this.bucket)
                                    .object(objectName)
                                    .build());
                            return true;
                        } catch (final CustomRunTimeException e) {
                            log.error("Error deleting file", e);
                            return false;
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    Uni<Boolean> renameFile(final String oldObjectName, final String newFilename, final String username) {
        final String newObjectName = generateObjectName(newFilename, username);

        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        try {
                            this.s3Client.copyObject(CopyObjectArgs.builder()
                                    .bucket(this.bucket)
                                    .object(newObjectName)
                                    .source(CopySource.builder()
                                            .bucket(this.bucket)
                                            .object(oldObjectName)
                                            .build())
                                    .build());

                            this.s3Client.removeObject(RemoveObjectArgs.builder()
                                    .bucket(this.bucket)
                                    .object(oldObjectName)
                                    .build());

                            return Boolean.TRUE;
                        } catch (final CustomRunTimeException e) {
                            log.error("Error renaming file", e);
                            throw new CustomRunTimeException("File rename failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    /**
     * List all files for a specific user with search, filter, and pagination support.
     *
     * @param username          the username whose files to list
     * @param lastUuid          cursor for pagination - last UUID from previous page
     * @param searchNamePattern search pattern to filter filenames
     * @param fileTypeFilter    filter by file type: "all", "images", "documents"
     * @param limit             number of items per page (default: 20)
     * @return FileListResult containing list of file objects with metadata and hasMore flag
     */
    Uni<FileListResult> listUserFiles(@NotNull final String username,
                                      @Nullable final String lastUuid,
                                      @Nullable final String searchNamePattern,
                                      @Nullable final String fileTypeFilter,
                                      final int limit) throws CustomRunTimeException {
        final int actualLimit = limit > 0 ? limit : 20;

        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        final String prefix = username + "/";
                        final ListObjectsArgs.Builder argsBuilder = ListObjectsArgs.builder()
                                .bucket(this.bucket)
                                .prefix(prefix)
                                .recursive(true);

                        final Iterable<Result<Item>> results = this.s3Client.listObjects(argsBuilder.build());
                        final List<FileInfoDto> files = new ArrayList<>();
                        final Iterator<Result<Item>> iterator = results.iterator();
                        final Set<String> seenUuids = new HashSet<>();
                        boolean foundLastUuid = StringUtils.isBlank(lastUuid);

                        while (iterator.hasNext() && files.size() <= actualLimit) {
                            try {
                                final FileInfoDto fileInfoDto = this.mapFile(iterator.next());

                                if (Objects.nonNull(fileInfoDto) && StringUtils.isNotBlank(fileInfoDto.uuid())) {
                                    if (!foundLastUuid) {
                                        if (fileInfoDto.uuid().equals(lastUuid)) {
                                            foundLastUuid = true;
                                        }
                                        continue;
                                    }

                                    if (seenUuids.contains(fileInfoDto.uuid())) {
                                        log.warn("Duplicate UUID found: {} for user: {}", fileInfoDto.uuid(), username);
                                        continue;
                                    }

                                    boolean matches = true;

                                    if (StringUtils.isNotBlank(searchNamePattern)) {
                                        matches = fileInfoDto.filename().toLowerCase()
                                                .contains(searchNamePattern.toLowerCase());
                                    }

                                    if (matches && StringUtils.isNotBlank(fileTypeFilter) && !"all".equalsIgnoreCase(fileTypeFilter)) {
                                        matches = RustfsService.matchesFileType(fileInfoDto.filename(), fileTypeFilter);
                                    }

                                    if (matches) {
                                        files.add(fileInfoDto);
                                        seenUuids.add(fileInfoDto.uuid());
                                    }
                                }
                            } catch (final ErrorResponseException | InsufficientDataException | InternalException |
                                           InvalidKeyException | InvalidResponseException | IOException |
                                           NoSuchAlgorithmException |
                                           ServerException | XmlParserException e) {
                                log.error("Error processing file result for user: {}", username, e);
                                throw new CustomRunTimeException("Failed to process file result", e);
                            }
                        }

                        final boolean hasMore = files.size() > actualLimit;
                        if (hasMore) {
                            files.remove(files.size() - 1);
                        }

                        return new FileListResult(files, hasMore);
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    /**
     * Get file counts and statistics for a specific user.
     *
     * @param username      the username whose files to count
     * @param searchPattern optional search filter to apply to filenames
     * @return FileCountsResult containing counts by type
     */
    Uni<FileCountsResult> getFileCounts(@NotNull final String username, @Nullable final String searchPattern) throws CustomRunTimeException {
        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        final String prefix = username + "/";
                        final ListObjectsArgs.Builder argsBuilder = ListObjectsArgs.builder()
                                .bucket(this.bucket)
                                .prefix(prefix)
                                .recursive(true);

                        final Iterable<Result<Item>> results = this.s3Client.listObjects(argsBuilder.build());
                        final Iterator<Result<Item>> iterator = results.iterator();

                        int total = 0;
                        int images = 0;
                        int documents = 0;

                        while (iterator.hasNext()) {
                            try {
                                final Item item = iterator.next().get();

                                if (item.size() > 0 && !item.objectName().endsWith("/")) {
                                    final String filename = extractFilenameFromObjectName(item.objectName());

                                    boolean matches = true;
                                    if (StringUtils.isNotBlank(searchPattern)) {
                                        matches = filename.toLowerCase().contains(searchPattern.toLowerCase());
                                    }

                                    if (matches) {
                                        total++;

                                        if (matchesFileType(filename, "images")) {
                                            images++;
                                        } else if (matchesFileType(filename, "documents")) {
                                            documents++;
                                        }
                                    }
                                }
                            } catch (final ErrorResponseException | InsufficientDataException | InternalException |
                                           InvalidKeyException | InvalidResponseException | IOException |
                                           NoSuchAlgorithmException |
                                           ServerException | XmlParserException e) {
                                log.error("Error processing file result for user: {}", username, e);
                                throw new CustomRunTimeException("Failed to process file result", e);
                            }
                        }

                        return new FileCountsResult(total, images, documents);
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    private FileInfoDto mapFile(final Result<Item> result) throws ErrorResponseException, InsufficientDataException, InternalException, InvalidKeyException, InvalidResponseException, IOException, NoSuchAlgorithmException, ServerException, XmlParserException {
        final Item item = result.get();

        if (item.size() > 0 && !item.objectName().endsWith("/")) {
            final String objectName = item.objectName();
            final String filename = extractFilenameFromObjectName(objectName);
            final String uuid = extractUuidFromObjectName(objectName);
            final String presignedUrl = this.generatePresignedUrl(objectName);

            return new FileInfoDto(
                    objectName,
                    filename,
                    item.size(),
                    Date.from(item.lastModified().toInstant()),
                    presignedUrl,
                    uuid
            );
        }
        return null;
    }

    /**
     * Generate a presigned GET URL for a private object.
     * The URL is time-limited (default 1 hour) and allows the React frontend
     * to access the file directly without exposing credentials or making the bucket public.
     *
     * @param objectName the object key inside the bucket
     * @return a presigned URL valid for {@code presignedUrlExpiry} seconds
     */
    private String generatePresignedUrl(final String objectName) {
        try {
            return this.s3Client.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(this.bucket)
                            .object(objectName)
                            .expiry(this.presignedUrlExpiry, TimeUnit.SECONDS)
                            .build()
            );
        } catch (final Exception e) {
            log.error("Failed to generate presigned URL for object '{}': {}", objectName, e.getMessage());
            throw new CustomRunTimeException("Failed to generate presigned URL for: " + objectName, e);
        }
    }

    /**
     * Result object containing the list of files and pagination metadata.
     */
    record FileListResult(List<FileInfoDto> files, boolean hasMore) {
    }

    /**
     * Result object containing file counts by type.
     */
    record FileCountsResult(int total, int images, int documents) {
    }
}

