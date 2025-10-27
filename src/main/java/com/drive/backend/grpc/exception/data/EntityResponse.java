package com.drive.backend.grpc.exception.data;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Standard error response format for REST APIs
 */
@Setter
@Getter
public class EntityResponse {
    private String errorId;
    private EntityMessage entityMessage;
    private LocalDateTime timestamp;

    public EntityResponse(String errorId, String message, boolean success) {
        this.errorId = errorId;
        entityMessage = new EntityMessage(message, success);
        timestamp = LocalDateTime.now();
    }
}
