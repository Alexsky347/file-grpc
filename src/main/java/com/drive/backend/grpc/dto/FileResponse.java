package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@RegisterForReflection
@Builder
@Getter
@Setter
public class FileResponse {
  private boolean success;
  private String message;
  private String fileUrl;
}
