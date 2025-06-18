package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class HelloResponse {
    private String message;

    public HelloResponse() {}

    public HelloResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "HelloResponse{message='" + message + "'}";
    }
}
