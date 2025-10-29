package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import com.drive.backend.grpc.service.HealthService;
import io.smallrye.mutiny.Uni;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class HealthResourceTest {

    @Mock
    private HealthService healthService;

    private HealthResource healthResource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        healthResource = new HealthResource();
        healthResource.healthService = healthService; // Inject mock
    }

    @Test
    void testCheckHealth() {
        HealthCheckResponse mockResponse = HealthCheckResponse.newBuilder()
                .setStatus(HealthCheckResponse.ServingStatus.SERVING)
                .build();
        when(healthService.check(any())).thenReturn(Uni.createFrom().item(mockResponse));

        Uni<HealthResource.HealthResponse> responseUni = healthResource.checkHealth("testService");

        HealthResource.HealthResponse response = responseUni.await().indefinitely();
        assertEquals("SERVING", response.status);
    }

    @Test
    void testLiveness() {
        String response = healthResource.liveness();
        assertEquals("{\"status\": \"UP\"}", response);
    }

    @Test
    void testReadiness() {
        String response = healthResource.readiness();
        assertEquals("{\"status\": \"READY\"}", response);
    }
}
