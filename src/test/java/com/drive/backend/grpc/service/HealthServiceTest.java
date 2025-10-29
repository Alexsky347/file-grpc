package com.drive.backend.grpc.service;

import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckRequest;
import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.helpers.test.UniAssertSubscriber;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthServiceTest {

    private final HealthService healthService = new HealthService();

    @Test
    void testCheckOverallHealth() {
        HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("").build();

        Uni<HealthCheckResponse> responseUni = healthService.check(request);

        HealthCheckResponse response = responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

        assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
    }

    @Test
    void testCheckFileInfoServiceHealth() {
        HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("com.drive.backend.grpc.service.FileInfoService").build();

        Uni<HealthCheckResponse> responseUni = healthService.check(request);

        HealthCheckResponse response = responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

        assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
    }

    @Test
    void testCheckUserServiceHealth() {
        HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("com.drive.backend.grpc.service.UserService").build();

        Uni<HealthCheckResponse> responseUni = healthService.check(request);

        HealthCheckResponse response = responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

        assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
    }

    @Test
    void testCheckHealthService() {
        HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("com.drive.backend.grpc.health.v1.Health").build();

        Uni<HealthCheckResponse> responseUni = healthService.check(request);

        HealthCheckResponse response = responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

        assertEquals(HealthCheckResponse.ServingStatus.SERVING, response.getStatus());
    }

    @Test
    void testCheckUnknownService() {
        HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("unknown.service").build();

        Uni<HealthCheckResponse> responseUni = healthService.check(request);

        HealthCheckResponse response = responseUni.subscribe().withSubscriber(UniAssertSubscriber.create()).awaitItem().getItem();

        assertEquals(HealthCheckResponse.ServingStatus.UNKNOWN, response.getStatus());
    }
}
