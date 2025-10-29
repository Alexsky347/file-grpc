package com.drive.backend.grpc.config;

import io.smallrye.config.ConfigMapping;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@ConfigMapping(prefix = "grpc-file")
public interface GrpcConfig {
  @Valid
  Minio minio();

  interface Minio {
    @NotBlank
    String url();

    @NotBlank
    String accessKey();

    @NotBlank
    String secretKey();

    @NotBlank
    String bucket();
  }
}
