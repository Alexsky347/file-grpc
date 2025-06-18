package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.dto.FileDeleteDto;
import com.drive.backend.grpc.dto.FileRenameDto;
import com.drive.backend.grpc.dto.FileResponse;
import com.drive.backend.grpc.service.MinioService;
import io.quarkus.example.FileDeleteRequest;
import io.quarkus.example.FileRenameRequest;
import io.quarkus.example.FileService;
import io.quarkus.example.FileUploadRequest;
import io.quarkus.grpc.GrpcClient;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.PathParam;
import lombok.extern.slf4j.Slf4j;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
@Slf4j
public class FileInfoResource {

    private final MinioService minioService;

    @GrpcClient
    FileService fileService;

    @Inject
    FileInfoResource(MinioService minioService) {
        this.minioService = minioService;
    }


    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Uni<FileResponse> uploadFile(@RestForm("file") FileUpload file,
                                        @RestForm("user") String user) {
        if (user == null || user.isEmpty()) {
            user = "anonymous";
        }

        final String username = user;

        return minioService.uploadFile(file, username)
                .onItem().transformToUni(objectName -> {
                    try {
                        byte[] fileContent = Files.readAllBytes(file.uploadedFile());

                        FileUploadRequest request = FileUploadRequest.newBuilder()
                                .setFilename(objectName) // Store the MinIO object name in gRPC
                                .setContent(com.google.protobuf.ByteString.copyFrom(fileContent))
                                .setUser(username)
                                .build();

                        return fileService.uploadFile(request)
                                .onItem().transform(response ->
                                        new FileResponse(response.getSuccess(),
                                                response.getMessage(),
                                                minioService.getMinioUrl() + "/" +
                                                        minioService.getBucketName() + "/" + objectName));
                    } catch (IOException e) {
                        return Uni.createFrom().item(
                                new FileResponse(false, "Error reading file: " + e.getMessage(), null));
                    }
                });
    }

    @DELETE
    @Path("/delete")
    public Uni<FileResponse> deleteFile(FileDeleteDto deleteDto) {
        String objectName = deleteDto.getFilename();
        String user = deleteDto.getUser();

        return minioService.deleteFile(objectName)
                .onItem().transformToUni(success -> {
                    if (Boolean.TRUE.equals(success)) {
                        FileDeleteRequest request = FileDeleteRequest.newBuilder()
                                .setFilename(objectName)
                                .setUser(user)
                                .build();

                        return fileService.deleteFile(request)
                                .onItem().transform(response ->
                                        new FileResponse(response.getSuccess(), response.getMessage()));
                    } else {
                        return Uni.createFrom().item(new FileResponse(false, "Failed to delete file from storage"));
                    }
                });
    }

    @PUT
    @Path("/rename")
    public Uni<FileResponse> renameFile(FileRenameDto renameDto) {
        String oldFilename = renameDto.getOldFilename();
        String newFilename = renameDto.getNewFilename();
        String user = renameDto.getUser();

        return minioService.renameFile(oldFilename, newFilename, user)
                .onItem().transformToUni(success -> {
                    if (Boolean.TRUE.equals(success)) {
                        FileRenameRequest request = FileRenameRequest.newBuilder()
                                .setOldFilename(oldFilename)
                                .setNewFilename(newFilename)
                                .setUser(user)
                                .build();

                        return fileService.renameFile(request)
                                .onItem().transform(response ->
                                        new FileResponse(response.getSuccess(), response.getMessage()));
                    } else {
                        return Uni.createFrom().item(new FileResponse(false, "Failed to rename file in storage"));
                    }
                });
    }

    /**
     * List all files for a specific user
     */
    @GET
    @Path("/list/{username}")
    public Uni<List<com.drive.backend.grpc.dto.FileInfo>> listUserFiles(@PathParam("username") String username) {
        if (username == null || username.isEmpty()) {
            username = "anonymous";
        }

        final String finalUsername = username;

        // Call the gRPC service to list files
        return fileService.listUserFiles(io.quarkus.example.ListUserFilesRequest.newBuilder()
                .setUsername(finalUsername)
                .build())
                .onItem().transform(response -> {
                    List<com.drive.backend.grpc.dto.FileInfo> files = new ArrayList<>();

                    // Convert from gRPC FileInfo to our DTO FileInfo
                    for (io.quarkus.example.FileInfo fileInfo : response.getFilesList()) {
                        files.add(new com.drive.backend.grpc.dto.FileInfo(
                            fileInfo.getObjectName(),
                            fileInfo.getFilename(),
                            fileInfo.getSize(),
                            new Date(fileInfo.getLastModified()),
                            fileInfo.getFileUrl()
                        ));
                    }

                    return files;
                });
    }
}
