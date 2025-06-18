package com.drive.backend.grpc.exception;

import java.io.Serial;

/**
 * Custom exception class for handling specific application errors.
 * This class extends RuntimeException and provides several constructors
 * to create exceptions with different levels of detail.
 */
public class CustomException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    public CustomException() {
    }

    public CustomException(String message) {
        super(message);
    }

    public CustomException(String message, Throwable cause) {
        super(message, cause);
    }

    public CustomException(Throwable cause) {
        super(cause);
    }

    public CustomException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}