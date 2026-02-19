package com.document.manager.backend.grpc.service;

import com.document.manager.backend.grpc.health.v1.HealthOuterClass.HealthCheckRequest;
import com.document.manager.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.helpers.test.UniAssertSubscriber;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthServiceTest {

  private final HealthService healthService = new HealthService();

  @Test
  void testCheckOverallHealth() {
    final HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("").build();

    final Uni<HealthCheckResponse> responseUni = this.healthService.check(request);

    final HealthCheckResponse response =
        responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

    assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
  }

  @Test
  void testCheckFileInfoServiceHealth() {
    final HealthCheckRequest request =
        HealthCheckRequest.newBuilder()
                .setService("service.grpc.com.document.manager.backend.FileInfoService")
            .build();

    final Uni<HealthCheckResponse> responseUni = this.healthService.check(request);

    final HealthCheckResponse response =
        responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

    assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
  }

  @Test
  void testCheckUserServiceHealth() {
    final HealthCheckRequest request =
        HealthCheckRequest.newBuilder()
            .setService("com.drive.backend.grpc.service.UserService")
            .build();

    final Uni<HealthCheckResponse> responseUni = this.healthService.check(request);

    final HealthCheckResponse response =
        responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

    assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
  }

  @Test
  void testCheckHealthService() {
    final HealthCheckRequest request =
        HealthCheckRequest.newBuilder()
                .setService("v1.health.grpc.com.document.manager.backend.Health")
            .build();

    final Uni<HealthCheckResponse> responseUni = this.healthService.check(request);

    final HealthCheckResponse response =
        responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

    assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
  }

  @Test
  void testCheckUnknownService() {
    final HealthCheckRequest request =
        HealthCheckRequest.newBuilder().setService("unknown.service").build();

    final Uni<HealthCheckResponse> responseUni = this.healthService.check(request);

    final HealthCheckResponse response =
        responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

    assertEquals(HealthCheckResponse.ServingStatus.UNKNOWN, response.getStatus());
  }
}
