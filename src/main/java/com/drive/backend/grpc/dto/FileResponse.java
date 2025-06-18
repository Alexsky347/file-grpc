package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class FileResponse {
    private boolean success;
    private String message;
    private String fileUrl;

    public FileResponse() {
    }

    public FileResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public FileResponse(boolean success, String message, String fileUrl) {
        this.success = success;
        this.message = message;
        this.fileUrl = fileUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    @Override
    public String toString() {
        return "FileResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", fileUrl='" + fileUrl + '\'' +
                '}';
    }
}
