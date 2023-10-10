package com.example.driveclone.utils.exception;

public class CustomRuntimeException extends RuntimeException {
    public CustomRuntimeException(Exception message) {
        super(message);
    }
}
