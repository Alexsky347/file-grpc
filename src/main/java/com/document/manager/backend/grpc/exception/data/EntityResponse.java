package com.document.manager.backend.grpc.exception.data;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/** Standard error response format for REST APIs */
@Setter
@Getter
public class EntityResponse {
  private String errorId;
  private EntityMessage entityMessage;
  private LocalDateTime timestamp;

  public EntityResponse(final String errorId, final String message, final boolean success) {
    this.errorId = errorId;
    this.entityMessage = new EntityMessage(message, success);
    this.timestamp = LocalDateTime.now();
  }
}
