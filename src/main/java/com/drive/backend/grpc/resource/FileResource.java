package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.dto.FileDeleteDto;
import com.drive.backend.grpc.dto.FileInfoDto;
import com.drive.backend.grpc.dto.FileRenameDto;
import com.drive.backend.grpc.dto.FileResponse;
import com.drive.backend.grpc.service.FileInfoService;
import com.drive.backend.grpc.service.MinioService;
import io.quarkus.example.FileDeleteRequest;
import io.quarkus.example.FileRenameRequest;
import io.quarkus.example.FileUploadRequest;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
@Slf4j
public class FileResource {

    private final MinioService minioService;

    private final FileInfoService fileInfoService;

    @Inject
    FileResource(MinioService minioService, @GrpcService FileInfoService fileInfoService) {
        this.minioService = minioService;
        this.fileInfoService = fileInfoService;
    }


    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Uni<FileResponse> uploadFile(@RestForm("file") FileUpload file,
                                        @RestForm("user") String user) {
        if (StringUtils.isBlank(user)) user = "anonymous";

        String username = user;

        return minioService.uploadFile(file, username)
                .onItem().transformToUni(objectName -> {
                    try {
                        FileUploadRequest request = FileUploadRequest.newBuilder()
                                .setFilename(objectName.trim()) // Store the MinIO object name in gRPC
                                .setContent(com.google.protobuf.ByteString.copyFrom(Files.readAllBytes(file.uploadedFile())))
                                .setUser(username)
                                .build();

                        return fileInfoService.uploadFile(request)
                                .onItem().transform(response -> {
                                    // URL encode the objectName to handle spaces and special characters
                                    String encodedObjectName = URLEncoder.encode(objectName, StandardCharsets.UTF_8)
                                            .replace("+", "%20"); // Replace + with %20 for spaces

                                    return FileResponse.builder().success(response.getSuccess())
                                            .message(response.getMessage())
                                            .fileUrl(minioService.getMinioUrl() + "/" +
                                                    minioService.getBucket() + "/" + encodedObjectName)
                                            .build();
                                });
                    } catch (IOException e) {
                        return Uni.createFrom().item(
                                FileResponse.builder().success(false).message("Error reading file:" + e.getMessage()).build()
                        );
                    }
                });
    }

    @DELETE
    @Path("/delete/{uuid}")
    public Uni<FileResponse> deleteFile(@PathParam("uuid") String uuid, FileDeleteDto deleteDto) {
        String user = deleteDto.getUser();

        // First, list user files to find the objectName by uuid
        return fileInfoService.listUserFiles(io.quarkus.example.ListUserFilesRequest.newBuilder()
                        .setUsername(user)
                        .build())
                .onItem().transformToUni(response -> {
                    if (!response.getSuccess())
                        return Uni.createFrom().item(FileResponse.builder().success(false).message("Failed to list user files").build());

                    // Find the file with the matching uuid
                    String objectName = null;
                    for (io.quarkus.example.FileInfo fileInfo : response.getFilesList())
                        if (uuid.equals(fileInfo.getUuid())) {
                            objectName = fileInfo.getObjectName();
                            break;
                        }

                    if (objectName == null)
                        return Uni.createFrom().item(FileResponse.builder().success(false).message("File not found with uuid: " + uuid).build());

                    // Now delete from MinIO
                    return minioService.deleteFile(objectName)
                            .onItem().transformToUni(success -> {
                                if (Boolean.TRUE.equals(success)) {
                                    FileDeleteRequest request = FileDeleteRequest.newBuilder()
                                            .setUuid(uuid)
                                            .setUser(user)
                                            .build();

                                    return fileInfoService.deleteFile(request)
                                            .onItem().transform(resp ->
                                                    FileResponse.builder().success(resp.getSuccess()).message(resp.getMessage()).build()
                                            );
                                }

                                return Uni.createFrom().item(FileResponse.builder().success(false).message("Failed to delete file from storage").build());
                            });
                });
    }

    @PUT
    @Path("/rename/{uuid}")
    public Uni<FileResponse> renameFile(@PathParam("uuid") String uuid, FileRenameDto renameDto) {
        String newFilename = renameDto.getNewFilename();
        String user = renameDto.getUser();

        // First, list user files to find the objectName by uuid
        return fileInfoService.listUserFiles(io.quarkus.example.ListUserFilesRequest.newBuilder()
                        .setUsername(user)
                        .build())
                .onItem().transformToUni(response -> {
                    if (!response.getSuccess())
                        return Uni.createFrom().item(FileResponse.builder().success(false).message("Failed to list user files").build());

                    // Find the file with the matching uuid
                    String oldObjectName = null;
                    for (io.quarkus.example.FileInfo fileInfo : response.getFilesList())
                        if (uuid.equals(fileInfo.getUuid())) {
                            oldObjectName = fileInfo.getObjectName();
                            break;
                        }

                    if (oldObjectName == null)
                        return Uni.createFrom().item(FileResponse.builder().success(false).message("File not found with uuid: " + uuid).build());

                    // Now rename in MinIO
                    return minioService.renameFile(oldObjectName, newFilename, user)
                            .onItem().transformToUni(success -> {
                                if (Boolean.TRUE.equals(success)) {
                                    FileRenameRequest request = FileRenameRequest.newBuilder()
                                            .setUuid(uuid)
                                            .setNewFilename(newFilename)
                                            .setUser(user)
                                            .build();

                                    return fileInfoService.renameFile(request)
                                            .onItem().transform(resp ->
                                                    FileResponse.builder().success(resp.getSuccess()).message(resp.getMessage()).build()
                                            );
                                } else return Uni.createFrom().item(
                                        FileResponse.builder().success(false).message("Failed to rename file in storage").build()
                                );
                            });
                });
    }

    /**
     * List all files for a specific user
     */
    @GET
    @Path("/list/{username}")
    public Uni<List<FileInfoDto>> listUserFiles(@PathParam("username") String username) {
        if (username == null || username.isEmpty()) username = "anonymous";

        String finalUsername = username;

        // Call the gRPC service to list files
        return fileInfoService.listUserFiles(io.quarkus.example.ListUserFilesRequest.newBuilder()
                        .setUsername(finalUsername)
                        .build())
                .onItem().transform(response -> {
                    List<FileInfoDto> files = new ArrayList<>();

                    // Convert from gRPC FileInfo to our DTO FileInfo
                    for (io.quarkus.example.FileInfo fileInfo : response.getFilesList())
                        files.add(new FileInfoDto(
                                fileInfo.getObjectName(),
                                fileInfo.getFilename(),
                                fileInfo.getSize(),
                                new Date(fileInfo.getLastModified()),
                                fileInfo.getFileUrl(),
                                fileInfo.getUuid()
                        ));

                    return files;
                });
    }
}
