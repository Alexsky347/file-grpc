package com.drive.backend.grpc.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import io.quarkus.grpc.GrpcService;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import java.security.Principal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

@QuarkusTest
class FileInfoServiceTest {

  @Inject @GrpcService FileInfoService fileInfoService;

  @InjectMock MinioService minioService;

  @InjectMock private SecurityIdentity identity;

  private Principal principal;

  @BeforeEach
  void setUp() {
    principal = Mockito.mock(Principal.class);
  }

  @Test
  void testGetUsernameSuccess() {
    when(identity.isAnonymous()).thenReturn(false);
    when(identity.getPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn("testuser");

    String username = fileInfoService.getUsername();
    assertEquals("testuser", username);
  }

  @Test
  void testGetUsernameAnonymous() {
    when(identity.isAnonymous()).thenReturn(true);

    SecurityException exception =
        assertThrows(SecurityException.class, () -> fileInfoService.getUsername());
    assertEquals("User not authenticated", exception.getMessage());
  }

  @Test
  void testGetUsernameNullPrincipal() {
    when(identity.isAnonymous()).thenReturn(false);
    when(identity.getPrincipal()).thenReturn(null);

    SecurityException exception =
        assertThrows(SecurityException.class, () -> fileInfoService.getUsername());
    assertEquals("User principal not available", exception.getMessage());
  }

  @Test
  void testGetUsernameNullName() {
    when(identity.isAnonymous()).thenReturn(false);
    when(identity.getPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn(null);

    SecurityException exception =
        assertThrows(SecurityException.class, () -> fileInfoService.getUsername());
    assertEquals("User principal not available", exception.getMessage());
  }
}
