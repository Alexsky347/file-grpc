package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

@RegisterForReflection
public class FileUploadDto {

    @RestForm("file")
    private FileUpload file;

    @RestForm("user")
    private String user;

    public FileUploadDto() {
    }


    public FileUpload getFile() {
        return file;
    }

    public void setFile(FileUpload file) {
        this.file = file;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
