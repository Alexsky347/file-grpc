package com.drive.backend.grpc.exception.data;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/** Standard error response format for REST APIs */
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
