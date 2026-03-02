package com.document.manager.backend.grpc.config;

import io.smallrye.config.ConfigMapping;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.OptionalInt;

@ConfigMapping(prefix = "grpc-file")
public interface GrpcConfig {
  @Valid
  Rustfs rustfs();

  interface Rustfs {
    @NotBlank
    String url();

    @NotBlank
    String accessKey();

    @NotBlank
    String secretKey();

    @NotBlank
    String bucket();

    /**
     * Presigned URL expiry duration in seconds. Defaults to 3600 (1 hour).
     */
    OptionalInt presignedUrlExpiry();
  }
}
