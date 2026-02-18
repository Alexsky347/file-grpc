package com.document.manager.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;

import java.util.Date;

@RegisterForReflection
@Builder
public record FileInfoDto(
    String objectName,
    String filename,
    long size,
    Date lastModified,
    String fileUrl,
    String uuid) {}
