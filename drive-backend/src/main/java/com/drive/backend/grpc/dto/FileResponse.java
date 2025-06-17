package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class FileResponse {
    private boolean success;
    private String message;

    public FileResponse() {
    }

    public FileResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
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

    @Override
    public String toString() {
        return "FileResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
