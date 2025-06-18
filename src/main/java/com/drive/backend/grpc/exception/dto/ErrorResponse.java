package com.drive.backend.grpc.exception.dto;

/**
 * Standard error response format for REST APIs
 */
public class ErrorResponse {
    private String errorId;
    private ErrorMessage error;

    public ErrorResponse() {
    }

    public ErrorResponse(String errorId, ErrorMessage error) {
        this.errorId = errorId;
        this.error = error;
    }

    public String getErrorId() {
        return errorId;
    }

    public void setErrorId(String errorId) {
        this.errorId = errorId;
    }

    public ErrorMessage getError() {
        return error;
    }

    public void setError(ErrorMessage error) {
        this.error = error;
    }

    /**
     * Inner class for error message details
     */
    public static class ErrorMessage {
        private String message;

        public ErrorMessage() {
        }

        public ErrorMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
