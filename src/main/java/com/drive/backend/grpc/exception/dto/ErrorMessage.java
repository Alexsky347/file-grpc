package com.drive.backend.grpc.exception.dto;

import java.time.LocalDateTime;

/**
 * ErrorMessage class represents a structured error response.
 * It contains fields for the error message, success status, timestamp, and request path.
 */
public class ErrorMessage {
    private String message;
    private boolean success;
    private LocalDateTime timestamp;
    private String path;

    // Default constructor
    public ErrorMessage() {
        this.timestamp = LocalDateTime.now();
    }

    // Constructor with message and success status
    public ErrorMessage(String message, boolean success) {
        this.message = message;
        this.success = success;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor with message, success status and path
    public ErrorMessage(String message, boolean success, String path) {
        this.message = message;
        this.success = success;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
