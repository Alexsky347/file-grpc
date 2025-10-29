package com.drive.backend.grpc.service;

import com.drive.backend.grpc.config.GrpcConfig;
import com.drive.backend.grpc.dto.FileInfoDto;
import com.drive.backend.grpc.exception.CustomRunTimeException;
import io.minio.*;
import io.minio.messages.Item;
import io.quarkus.runtime.StartupEvent;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.ByteArrayInputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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
    MinioService(Vertx vertx, GrpcConfig grpcConfig) {
        this.vertx = vertx;
        minioUrl = grpcConfig.minio().url();
        accessKey = grpcConfig.minio().accessKey();
        secretKey = grpcConfig.minio().secretKey();
        bucket = grpcConfig.minio().bucket();
    }

    /**
     * Extract original filename from MinIO object name
     * Format is: username/uuid-filename
     */
    private static String extractFilenameFromObjectName(String objectName) {
        // Get everything after the last slash
        String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        // Remove the UUID prefix (everything before the first dash after the UUID)
        int dashIndex = nameWithUuid.indexOf('-', 36); // UUID is 36 chars
        if (dashIndex >= 0 && dashIndex < nameWithUuid.length() - 1) return nameWithUuid.substring(dashIndex + 1);
        return nameWithUuid; // Fallback if format is unexpected
    }

    /**
     * Extract UUID from MinIO object name
     * Format is: username/uuid-filename
     */
    private static String extractUuidFromObjectName(String objectName) {
        // Get everything after the last slash
        String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        // Extract the UUID (first 36 characters before the dash)
        if (nameWithUuid.length() > 36 && nameWithUuid.charAt(36) == '-') return nameWithUuid.substring(0, 36);
        return null; // Fallback if format is unexpected
    }

    private static String generateObjectName(String filename, String username) {
        // Create a structure like: username/uuid-filename
        String uuid = UUID.randomUUID().toString();

        return username + "/" + uuid + "-" + (StringUtils.isBlank(filename) ? "random" : filename);
    }

    void onStart(@Observes StartupEvent ev) {
        log.info("Initializing MinIO client");
        initMinioClient();
        createBucketIfNotExists();
    }

    private void initMinioClient() {
        minioClient = MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
    }

    private void createBucketIfNotExists() {
        try {
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!bucketExists) {
                log.info("Creating bucket: " + bucket);
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());

                // Set the bucket policy to public read
                setBucketPolicy();
            } else {
                log.info("Bucket already exists: " + bucket);
                // Make sure the policy is set even if the bucket exists
                setBucketPolicy();
            }
        } catch (Exception e) {
            log.error("Error checking/creating bucket", e);
            throw new CustomRunTimeException("Failed to create or access bucket: " + bucket, e);
        }
    }

    /**
     * Set bucket policy to allow public read access
     */
    private void setBucketPolicy() {
        try {
            // Define a policy that allows public read access to objects
            String policy = "{\n" +
                    "    \"Version\": \"2012-10-17\",\n" +
                    "    \"Statement\": [\n" +
                    "        {\n" +
                    "            \"Effect\": \"Allow\",\n" +
                    "            \"Principal\": \"*\",\n" +
                    "            \"Action\": [\n" +
                    "                \"s3:GetObject\"\n" +
                    "            ],\n" +
                    "            \"Resource\": [\n" +
                    "                \"arn:aws:s3:::" + bucket + "/*\"\n" +
                    "            ]\n" +
                    "        }\n" +
                    "    ]\n" +
                    "}";

            // Set the bucket policy
            minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
                    .bucket(bucket)
                    .config(policy)
                    .build());

            log.info("Bucket policy set to public read for bucket: " + bucket);
        } catch (Exception e) {
            log.error("Error setting bucket policy", e);
            throw new CustomRunTimeException("Failed to set bucket policy", e);
        }
    }

    Uni<String> uploadFile(byte[] content, String filename, String username) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            // Generate a unique object name
                            String objectName = generateObjectName(filename, username);

                            // Upload to MinIO
                            minioClient.putObject(PutObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(objectName)
                                    .stream(new ByteArrayInputStream(content), content.length, -1)
                                    .build());
                            return objectName;
                        } catch (Exception e) {
                            log.error("Error uploading file", e);
                            throw new CustomRunTimeException("File upload failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    Uni<Boolean> deleteFile(String objectName) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            minioClient.removeObject(RemoveObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(objectName)
                                    .build());
                            return true;
                        } catch (CustomRunTimeException e) {
                            log.error("Error deleting file", e);
                            return false;
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    Uni<Boolean> renameFile(String oldObjectName, String newFilename, String username) {
        String newObjectName = generateObjectName(newFilename, username);

        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            // Copy to new location
                            minioClient.copyObject(CopyObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(newObjectName)
                                    .source(CopySource.builder()
                                            .bucket(bucket)
                                            .object(oldObjectName)
                                            .build())
                                    .build());

                            // Delete old object
                            minioClient.removeObject(RemoveObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(oldObjectName)
                                    .build());

                            return Boolean.TRUE;
                        } catch (CustomRunTimeException e) {
                            log.error("Error renaming file", e);
                            throw new CustomRunTimeException("File rename failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    /**
     * List all files for a specific user
     *
     * @param username the username whose files to list
     * @return List of file objects with metadata
     */
    Uni<List<FileInfoDto>> listUserFiles(String username) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            // List objects with the prefix of the username folder
                            Iterable<Result<Item>> results = minioClient.listObjects(
                                    ListObjectsArgs.builder()
                                            .bucket(bucket)
                                            .prefix(username + "/")
                                            .recursive(true)
                                            .build());

                            List<FileInfoDto> files = new ArrayList<>();

                            for (Result<Item> result : results) {
                                Item item = result.get();

                                // Skip folders (they have size 0 and end with /)
                                if (item.size() > 0 && !item.objectName().endsWith("/")) {
                                    // Extract the original filename (remove UUID prefix)
                                    String objectName = item.objectName();
                                    String filename = extractFilenameFromObjectName(objectName);
                                    String uuid = extractUuidFromObjectName(objectName);

                                    // URL encode the object name for the file URL
                                    String encodedObjectName = URLEncoder.encode(objectName, StandardCharsets.UTF_8)
                                            .replace("+", "%20"); // Replace + with %20 for spaces

                                    if (uuid != null) files.add(new FileInfoDto(
                                            objectName,
                                            filename,
                                            item.size(),
                                            Date.from(item.lastModified().toInstant()),
                                            minioUrl + "/" + bucket + "/" + encodedObjectName,
                                            uuid
                                    ));
                                }
                            }

                            return files;
                        } catch (Exception e) {
                            log.error("Error listing files for user: " + username, e);
                            throw new CustomRunTimeException("Failed to list user files", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

}
