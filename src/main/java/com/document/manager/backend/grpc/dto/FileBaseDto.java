package com.document.manager.backend.grpc.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;
import org.jboss.resteasy.reactive.RestForm;

/**
 * Base DTO containing common fields shared across file operations. Similar to TypeScript's base
 * interface for extending with Pick/Omit.
 */
@Setter
@Getter
@RegisterForReflection
abstract class FileBaseDto {
  @RestForm("user")
  private String user;
}
