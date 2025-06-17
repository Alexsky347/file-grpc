package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class FileDeleteDto {
    private String filename;
    private String user;

    public FileDeleteDto() {
    }

    public FileDeleteDto(String filename, String user) {
        this.filename = filename;
        this.user = user;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
