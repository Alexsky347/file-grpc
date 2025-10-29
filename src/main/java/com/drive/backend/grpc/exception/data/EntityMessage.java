package com.drive.backend.grpc.exception.data;

import lombok.Getter;
import lombok.Setter;

/**
 * ErrorMessage class represents a structured error response. It contains fields for the error
 * message, success status, timestamp, and request path.
 */
@Setter
@Getter
public class EntityMessage {

  private String message;
  private boolean success;

  public EntityMessage(String message, boolean success) {
    this.message = message;
    this.success = success;
  }
}
