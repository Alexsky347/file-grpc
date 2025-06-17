package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.dto.FileDeleteDto;
import com.drive.backend.grpc.dto.FileRenameDto;
import com.drive.backend.grpc.dto.FileResponse;
import com.drive.backend.grpc.dto.FileUploadDto;
import io.quarkus.example.FileDeleteRequest;
import io.quarkus.example.FileRenameRequest;
import io.quarkus.example.FileService;
import io.quarkus.example.FileUploadRequest;
import io.quarkus.grpc.GrpcClient;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.io.IOException;
import java.nio.file.Files;

@Path("/api/files")
@Produces(MediaType.APPLICATION_JSON)
public class FileInfoResource {

    @GrpcClient
    FileService fileService;

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Uni<FileResponse> uploadFile(FileUploadDto uploadDto) {
        try {
            byte[] fileContent = Files.readAllBytes(uploadDto.getFile().uploadedFile());

            FileUploadRequest request = FileUploadRequest.newBuilder()
                    .setFilename(uploadDto.getFilename())
                    .setContent(com.google.protobuf.ByteString.copyFrom(fileContent))
                    .setUser(uploadDto.getUser())
                    .build();

            return fileService.uploadFile(request)
                    .onItem().transform(response ->
                            new FileResponse(response.getSuccess(), response.getMessage()));
        } catch (IOException e) {
            return Uni.createFrom().item(new FileResponse(false, "Error reading file: " + e.getMessage()));
        }
    }

    @DELETE
    @Path("/delete")
    public Uni<FileResponse> deleteFile(FileDeleteDto deleteDto) {
        FileDeleteRequest request = FileDeleteRequest.newBuilder()
                .setFilename(deleteDto.getFilename())
                .setUser(deleteDto.getUser())
                .build();

        return fileService.deleteFile(request)
                .onItem().transform(response ->
                        new FileResponse(response.getSuccess(), response.getMessage()));
    }

    @PUT
    @Path("/rename")
    public Uni<FileResponse> renameFile(FileRenameDto renameDto) {
        FileRenameRequest request = FileRenameRequest.newBuilder()
                .setOldFilename(renameDto.getOldFilename())
                .setNewFilename(renameDto.getNewFilename())
                .setUser(renameDto.getUser())
                .build();

        return fileService.renameFile(request)
                .onItem().transform(response ->
                        new FileResponse(response.getSuccess(), response.getMessage()));
    }
}
