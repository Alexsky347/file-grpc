package com.document.manager.backend.grpc.security;

import lombok.NoArgsConstructor;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class Role {
  public static final String USER = "user";
  public static final String ADMIN = "admin";
}
