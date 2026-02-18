package com.document.manager.backend.grpc.service;

import com.document.manager.backend.grpc.NoDbProfile;
import io.quarkus.grpc.GrpcService;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestProfile(NoDbProfile.class)
class FileInfoServiceTest {

    @Inject
    FileInfoService fileInfoService;

    @InjectMock
    MinioService minioService;

    @InjectMock
    private SecurityIdentity identity;

    private Principal principal;

    @BeforeEach
    void setUp() {
        this.principal = Mockito.mock(Principal.class);
    }

    @Test
    void testGetUsername_success() throws Exception {
        when(this.identity.isAnonymous()).thenReturn(false);
        when(this.identity.getPrincipal()).thenReturn(this.principal);
        when(this.principal.getName()).thenReturn("testuser");
        final String username = this.invokeGetUsername();
        assertEquals("testuser", username);
    }

    @Test
    void testGetUsername_anonymous() throws Exception {
        when(this.identity.isAnonymous()).thenReturn(true);
        assertThrows(SecurityException.class, this::invokeGetUsername);
    }

    @Test
    void testGetUsername_nullPrincipal() throws Exception {
        when(this.identity.isAnonymous()).thenReturn(false);
        when(this.identity.getPrincipal()).thenReturn(null);
        assertThrows(SecurityException.class, this::invokeGetUsername);
    }

    @Test
    void testGetUsername_nullPrincipalName() throws Exception {
        when(this.identity.isAnonymous()).thenReturn(false);
        when(this.identity.getPrincipal()).thenReturn(this.principal);
        when(this.principal.getName()).thenReturn(null);
        assertThrows(SecurityException.class, this::invokeGetUsername);
    }

    // Reflection helper to access private getUsername()
    private String invokeGetUsername() throws Exception {
        final var method = FileInfoService.class.getDeclaredMethod("getUsername");
        method.setAccessible(true);
        try {
            return (String) method.invoke(this.fileInfoService);
        } catch (java.lang.reflect.InvocationTargetException e) {
            if (e.getCause() instanceof SecurityException se) {
                throw se;
            }
            throw e;
        }
    }

}
