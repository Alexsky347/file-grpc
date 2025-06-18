package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class FileRenameDto {
    private String oldFilename;
    private String newFilename;
    private String user;

    public FileRenameDto() {
    }

    public FileRenameDto(String oldFilename, String newFilename, String user) {
        this.oldFilename = oldFilename;
        this.newFilename = newFilename;
        this.user = user;
    }

    public String getOldFilename() {
        return oldFilename;
    }

    public void setOldFilename(String oldFilename) {
        this.oldFilename = oldFilename;
    }

    public String getNewFilename() {
        return newFilename;
    }

    public void setNewFilename(String newFilename) {
        this.newFilename = newFilename;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
