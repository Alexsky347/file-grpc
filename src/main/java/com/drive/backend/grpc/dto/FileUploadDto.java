package com.drive.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

@RegisterForReflection
@Getter
@Setter
public class FileUploadDto extends FileBaseDto {
  @RestForm("file")
  private FileUpload file;
}
