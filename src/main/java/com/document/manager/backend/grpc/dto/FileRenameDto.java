package com.document.manager.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;

@RegisterForReflection
@Getter
@Setter
public class FileRenameDto extends FileBaseDto {
  private String newFilename;
}
