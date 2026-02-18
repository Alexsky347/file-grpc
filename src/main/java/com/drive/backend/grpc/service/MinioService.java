package com.drive.backend.grpc.service;

import com.drive.backend.grpc.config.GrpcConfig;
import com.drive.backend.grpc.dto.FileInfoDto;
import com.drive.backend.grpc.exception.CustomRunTimeException;
import io.minio.*;
import io.minio.errors.*;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@ApplicationScoped
@Slf4j
public class MinioService {

    // Explicit getter methods for minioUrl and bucket
    @Getter
    private final String minioUrl;
    @Getter
    private final String bucket;

    private final Vertx vertx;
    private final String accessKey;
    private final String secretKey;
    private MinioClient minioClient;

    @Inject
    MinioService(final Vertx vertx, final GrpcConfig grpcConfig) {
        this.vertx = vertx;
        this.minioUrl = grpcConfig.minio().url();
        this.accessKey = grpcConfig.minio().accessKey();
        this.secretKey = grpcConfig.minio().secretKey();
        this.bucket = grpcConfig.minio().bucket();
    }

    /**
     * Extract original filename from MinIO object name
     * Format is: username/uuid-filename
     */
    private static String extractFilenameFromObjectName(final String objectName) {
        // Get everything after the last slash
        final String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        // Remove the UUID prefix (everything before the first dash after the UUID)
        final int dashIndex = nameWithUuid.indexOf('-', 36); // UUID is 36 chars
        if (dashIndex >= 0 && dashIndex < nameWithUuid.length() - 1) {
            return nameWithUuid.substring(dashIndex + 1);
        }
        return nameWithUuid; // Fallback if format is unexpected
    }

    /**
     * Extract UUID from MinIO object name
     * Format is: username/uuid-filename
     */
    private static String extractUuidFromObjectName(final String objectName) {
        // Get everything after the last slash
        final String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        // Extract the UUID (first 36 characters before the dash)
        if (nameWithUuid.length() > 36 && nameWithUuid.charAt(36) == '-') {
            return nameWithUuid.substring(0, 36);
        }
        return null; // Fallback if format is unexpected
    }

    private static String generateObjectName(final String filename, final String username) {
        // Create a structure like: username/uuid-filename
        final String uuid = UUID.randomUUID().toString();

        return username + "/" + uuid + "-" + (StringUtils.isBlank(filename) ? "random" : filename);
    }

    void onStart(@Observes final StartupEvent ev) {
        log.info("Initializing MinIO client");
        this.initMinioClient();
        this.createBucketIfNotExists();
    }

    private void initMinioClient() {
        this.minioClient = MinioClient.builder()
                .endpoint(this.minioUrl)
                .credentials(this.accessKey, this.secretKey)
                .build();
    }

    private void createBucketIfNotExists() {
        try {
            final boolean bucketExists = this.minioClient.bucketExists(BucketExistsArgs.builder().bucket(this.bucket).build());
            if (!bucketExists) {
                log.info("Creating bucket: " + this.bucket);
                this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(this.bucket).build());

                // Set the bucket policy to public read
                this.setBucketPolicy();
            } else {
                log.info("Bucket already exists: " + this.bucket);
                // Make sure the policy is set even if the bucket exists
                this.setBucketPolicy();
            }
        } catch (final Exception e) {
            log.error("Error checking/creating bucket", e);
            throw new CustomRunTimeException("Failed to create or access bucket: " + this.bucket, e);
        }
    }

    /**
     * Set bucket policy to allow public read access
     */
    private void setBucketPolicy() {
        try {
            // Define a policy that allows public read access to objects
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

            // Set the bucket policy
            this.minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
                    .bucket(this.bucket)
                    .config(policy)
                    .build());

            log.info("Bucket policy set to public read for bucket: " + this.bucket);
        } catch (final Exception e) {
            log.error("Error setting bucket policy", e);
            throw new CustomRunTimeException("Failed to set bucket policy", e);
        }
    }

    Uni<String> uploadFile(final byte[] content, final String filename, final String username) {
        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        try {
                            // Generate a unique object name
                            final String objectName = generateObjectName(filename, username);

                            // Upload to MinIO
                            this.minioClient.putObject(PutObjectArgs.builder()
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
                            this.minioClient.removeObject(RemoveObjectArgs.builder()
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
                            // Copy to new location
                            this.minioClient.copyObject(CopyObjectArgs.builder()
                                    .bucket(this.bucket)
                                    .object(newObjectName)
                                    .source(CopySource.builder()
                                            .bucket(this.bucket)
                                            .object(oldObjectName)
                                            .build())
                                    .build());

                            // Delete old object
                            this.minioClient.removeObject(RemoveObjectArgs.builder()
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
     * Result object containing the list of files and pagination metadata
     */
    record FileListResult(List<FileInfoDto> files, boolean hasMore) {}

    /**
     * List all files for a specific user with search, filter, and pagination support
     *
     * @param username the username whose files to list
     * @param lastUuid cursor for pagination - last UUID from previous page
     * @param searchNamePattern search pattern to filter filenames
     * @param fileTypeFilter filter by file type: "all", "images", "documents"
     * @param limit number of items per page (default: 20)
     * @return FileListResult containing list of file objects with metadata and hasMore flag
     */
    Uni<FileListResult> listUserFiles(@NotNull final String username,
                                         @Nullable final String lastUuid,
                                         @Nullable final String searchNamePattern,
                                         @Nullable final String fileTypeFilter,
                                         final int limit) throws CustomRunTimeException {
        final int actualLimit = limit > 0 ? limit : 20; // Default to 20 if not specified

        return Uni.createFrom().emitter(emitter -> {
            this.vertx.executeBlocking(() -> {
                        final String prefix = username + "/";
                        final ListObjectsArgs.Builder argsBuilder = ListObjectsArgs.builder()
                                .bucket(this.bucket)
                                .prefix(prefix)
                                .recursive(true);

                        // Note: startAfter is NOT used here because we only have UUID, not full object name
                        // Instead, we'll skip files until we find the one after lastUuid

                        final Iterable<Result<Item>> results = this.minioClient.listObjects(argsBuilder.build());
                        final List<FileInfoDto> files = new ArrayList<>();
                        final Iterator<Result<Item>> iterator = results.iterator();
                        final Set<String> seenUuids = new HashSet<>(); // Track seen UUIDs to prevent duplicates
                        boolean foundLastUuid = StringUtils.isBlank(lastUuid); // If no lastUuid, start immediately

                        // Fetch one extra item to check if there are more pages
                        while (iterator.hasNext() && files.size() <= actualLimit) {
                            try {
                                final FileInfoDto fileInfoDto = this.mapFile(iterator.next());

                                if (Objects.nonNull(fileInfoDto) && StringUtils.isNotBlank(fileInfoDto.uuid())) {
                                    // Skip until we find the file after lastUuid
                                    if (!foundLastUuid) {
                                        if (fileInfoDto.uuid().equals(lastUuid)) {
                                            foundLastUuid = true;
                                        }
                                        continue; // Skip this file and all before lastUuid
                                    }

                                    // Skip duplicates
                                    if (seenUuids.contains(fileInfoDto.uuid())) {
                                        log.warn("Duplicate UUID found: {} for user: {}", fileInfoDto.uuid(), username);
                                        continue;
                                    }

                                    boolean matches = true;

                                    // Apply filename search filter
                                    if (StringUtils.isNotBlank(searchNamePattern)) {
                                        matches = fileInfoDto.filename().toLowerCase()
                                                .contains(searchNamePattern.toLowerCase());
                                    }

                                    // Apply file type filter
                                    if (matches && StringUtils.isNotBlank(fileTypeFilter) && !"all".equalsIgnoreCase(fileTypeFilter)) {
                                        matches = MinioService.matchesFileType(fileInfoDto.filename(), fileTypeFilter);
                                    }

                                    if (matches) {
                                        files.add(fileInfoDto);
                                        seenUuids.add(fileInfoDto.uuid());
                                    }
                                }
                            } catch (final ErrorResponseException | InsufficientDataException | InternalException |
                                           InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException |
                                           ServerException | XmlParserException e) {
                                log.error("Error processing file result for user: {}", username, e);
                                throw new CustomRunTimeException("Failed to process file result", e);
                            }
                        }

                        // Check if there are more files beyond the requested limit
                        final boolean hasMore = files.size() > actualLimit;

                        // Remove the extra item if we fetched more than the limit
                        if (hasMore) {
                            files.remove(files.size() - 1);
                        }

                        return new FileListResult(files, hasMore);
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    /**
     * Check if filename matches the specified file type filter
     *
     * @param filename the filename to check
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

    /**
     * Result object containing file counts by type
     */
    record FileCountsResult(
            int total,
            int images,
            int documents
    ) {}

    /**
     * Get file counts and statistics for a specific user
     *
     * @param username the username whose files to count
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

                        final Iterable<Result<Item>> results = this.minioClient.listObjects(argsBuilder.build());
                        final Iterator<Result<Item>> iterator = results.iterator();

                        int total = 0;
                        int images = 0;
                        int documents = 0;

                        while (iterator.hasNext()) {
                            try {
                                final Item item = iterator.next().get();

                                // Skip folders
                                if (item.size() > 0 && !item.objectName().endsWith("/")) {
                                    final String filename = extractFilenameFromObjectName(item.objectName());

                                    // Apply search filter if provided
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
                                           InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException |
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

        // Skip folders (they have size 0 and end with /)
        if (item.size() > 0 && !item.objectName().endsWith("/")) {
            // Extract the original filename (remove UUID prefix)
            final String objectName = item.objectName();
            final String filename = extractFilenameFromObjectName(objectName);
            final String uuid = extractUuidFromObjectName(objectName);

            // URL encode the object name for the file URL
            final String encodedObjectName = URLEncoder.encode(objectName, StandardCharsets.UTF_8)
                    .replace("+", "%20"); // Replace + with %20 for spaces
            return new FileInfoDto(
                    objectName,
                    filename,
                    item.size(),
                    Date.from(item.lastModified().toInstant()),
                    this.minioUrl + "/" + this.bucket + "/" + encodedObjectName,
                    uuid
            );
        }
        return null;
    }

}
