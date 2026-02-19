package com.document.manager.backend.grpc.resource;

import com.document.manager.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import com.document.manager.backend.grpc.service.HealthService;
import io.smallrye.mutiny.Uni;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class HealthResourceTest {

  @Mock private HealthService healthService;

  private HealthResource healthResource;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    this.healthResource = new HealthResource();
    this.healthResource.healthService = this.healthService; // Inject mock
  }

  @Test
  void testCheckHealth() {
    final HealthCheckResponse mockResponse =
        HealthCheckResponse.newBuilder()
            .setStatus(HealthCheckResponse.ServingStatus.SERVING)
            .build();
    when(this.healthService.check(any())).thenReturn(Uni.createFrom().item(mockResponse));

    final Uni<HealthResource.HealthResponse> responseUni = this.healthResource.checkHealth("testService");

    final HealthResource.HealthResponse response = responseUni.await().indefinitely();
    assertEquals("SERVING", response.status);
  }

  @Test
  void testLiveness() {
    final String response = this.healthResource.liveness();
    assertEquals("{\"status\": \"UP\"}", response);
  }

  @Test
  void testReadiness() {
    final String response = this.healthResource.readiness();
    assertEquals("{\"status\": \"READY\"}", response);
  }
}
