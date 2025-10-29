package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import java.util.Date;
import lombok.Builder;

@RegisterForReflection
@Builder
public record FileInfoDto(
    String objectName,
    String filename,
    long size,
    Date lastModified,
    String fileUrl,
    String uuid) {}
