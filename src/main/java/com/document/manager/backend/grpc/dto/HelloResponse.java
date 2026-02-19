package com.document.manager.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class HelloResponse {
  private String message;

  public HelloResponse() {}

  public HelloResponse(final String message) {
    this.message = message;
  }

  public String getMessage() {
    return this.message;
  }

  public void setMessage(final String message) {
    this.message = message;
  }

  @Override
  public String toString() {
    return "HelloResponse{message='" + this.message + "'}";
  }
}
