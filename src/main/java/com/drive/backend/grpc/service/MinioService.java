package com.drive.backend.grpc.service;

import com.drive.backend.grpc.config.GrpcConfig;
import com.drive.backend.grpc.dto.FileInfo;
import com.drive.backend.grpc.exception.CustomRunTimeException;
import io.minio.*;
import io.minio.messages.Item;
import io.quarkus.logging.Log;
import io.quarkus.runtime.StartupEvent;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class MinioService {


    private final Vertx vertx;
    private final String minioUrl;
    private final String accessKey;
    private final String secretKey;
    private final String bucket;

    @Inject
    MinioService(Vertx vertx, GrpcConfig grpcConfig) {
        this.vertx = vertx;
        this.minioUrl = grpcConfig.minio().url();
        this.accessKey = grpcConfig.minio().accessKey();
        this.secretKey = grpcConfig.minio().secretKey();
        this.bucket = grpcConfig.minio().bucket();
    }

    // Explicit getter methods for minioUrl and bucket
    public String getMinioUrl() {
        return minioUrl;
    }

    public String getBucketName() {
        return bucket;
    }

    private MinioClient minioClient;

    void onStart(@Observes StartupEvent ev) {
        Log.info("Initializing MinIO client");
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
                Log.info("Creating bucket: " + bucket);
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());

                // Set the bucket policy to public read
                setBucketPolicy();
            } else {
                Log.info("Bucket already exists: " + bucket);
                // Make sure the policy is set even if the bucket exists
                setBucketPolicy();
            }
        } catch (Exception e) {
            Log.error("Error checking/creating bucket", e);
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

            Log.info("Bucket policy set to public read for bucket: " + bucket);
        } catch (Exception e) {
            Log.error("Error setting bucket policy", e);
            throw new CustomRunTimeException("Failed to set bucket policy", e);
        }
    }

    public Uni<String> uploadFile(FileUpload fileUpload, String username) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            // Generate a unique object name
                            String objectName = generateObjectName(fileUpload.fileName(), username);

                            // Read file content
                            byte[] fileContent = Files.readAllBytes(fileUpload.uploadedFile());

                            // Upload to MinIO
                            minioClient.putObject(PutObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(objectName)
                                    .contentType(fileUpload.contentType())
                                    .stream(new ByteArrayInputStream(fileContent), fileContent.length, -1)
                                    .build());

                            return objectName;
                        } catch (CustomRunTimeException e) {
                            Log.error("Error uploading file", e);
                            throw new CustomRunTimeException("File upload failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    public Uni<Boolean> deleteFile(String objectName) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            minioClient.removeObject(RemoveObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(objectName)
                                    .build());
                            return true;
                        } catch (CustomRunTimeException e) {
                            Log.error("Error deleting file", e);
                            return false;
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    public Uni<InputStream> downloadFile(String objectName) {
        return Uni.createFrom().emitter(emitter -> {
            vertx.executeBlocking(() -> {
                        try {
                            return minioClient.getObject(GetObjectArgs.builder()
                                    .bucket(bucket)
                                    .object(objectName)
                                    .build());
                        } catch (CustomRunTimeException e) {
                            Log.error("Error downloading file", e);
                            throw new CustomRunTimeException("File download failed", e);
                        }
                    })
                    .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    public Uni<Boolean> renameFile(String oldObjectName, String newFilename, String username) {
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
                            Log.error("Error renaming file", e);
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
    public Uni<List<FileInfo>> listUserFiles(String username) {
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

                    List<FileInfo> files = new ArrayList<>();

                    for (Result<Item> result : results) {
                        Item item = result.get();

                        // Skip folders (they have size 0 and end with /)
                        if (item.size() > 0 && !item.objectName().endsWith("/")) {
                            // Extract the original filename (remove UUID prefix)
                            String objectName = item.objectName();
                            String filename = extractFilenameFromObjectName(objectName);

                            // URL encode the object name for the file URL
                            String encodedObjectName = URLEncoder.encode(objectName, StandardCharsets.UTF_8)
                                    .replace("+", "%20"); // Replace + with %20 for spaces

                            files.add(new FileInfo(
                                    objectName,
                                    filename,
                                    item.size(),
                                    Date.from(item.lastModified().toInstant()),
                                    minioUrl + "/" + bucket + "/" + encodedObjectName
                            ));
                        }
                    }

                    return files;
                } catch (Exception e) {
                    Log.error("Error listing files for user: " + username, e);
                    throw new CustomRunTimeException("Failed to list user files", e);
                }
            })
            .subscribe().with(emitter::complete, emitter::fail);
        });
    }

    /**
     * Extract original filename from MinIO object name
     * Format is: username/uuid-filename
     */
    private String extractFilenameFromObjectName(String objectName) {
        // Get everything after the last slash
        String nameWithUuid = objectName.substring(objectName.lastIndexOf('/') + 1);
        // Remove the UUID prefix (everything before the first dash after the UUID)
        int dashIndex = nameWithUuid.indexOf('-', 36); // UUID is 36 chars
        if (dashIndex >= 0 && dashIndex < nameWithUuid.length() - 1) {
            return nameWithUuid.substring(dashIndex + 1);
        }
        return nameWithUuid; // Fallback if format is unexpected
    }

    private String generateObjectName(String filename, String username) {
        // Create a structure like: username/uuid-filename
        String uuid = UUID.randomUUID().toString();
        return username + "/" + uuid + "-" + filename;
    }

}
