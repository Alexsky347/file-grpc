package com.example.driveclone.utils.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;

@Getter
public class CustomExceptionWithRequest extends RuntimeException {
    private final HttpServletRequest request;

    public CustomExceptionWithRequest(String message, HttpServletRequest request) {
        super(message);
        this.request = request;
    }

}