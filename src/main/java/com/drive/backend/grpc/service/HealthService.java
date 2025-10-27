package com.drive.backend.grpc.service;

import com.drive.backend.grpc.health.v1.Health;
import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckRequest;
import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import io.quarkus.grpc.GrpcService;
import io.smallrye.common.annotation.RunOnVirtualThread;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Singleton;
import org.jboss.logging.Logger;

import java.time.Duration;

/**
 * Health Check gRPC Service Implementation.
 * Provides health status checks for the gRPC services.
 */
@Singleton
@GrpcService
public class HealthService implements Health {

    private static final Logger logger = Logger.getLogger(HealthService.class);

    /**
     * Check the health of the FileInfoService.
     * You can add database checks, external service checks, etc.
     *
     * @return The serving status of the file service
     */
    private static HealthCheckResponse.ServingStatus checkFileServiceHealth() {
        try {
            // Add your file service health checks here
            // For now, we assume it's healthy
            return HealthCheckResponse.ServingStatus.SERVING;
        } catch (Exception e) {
            logger.errorf(e, "FileInfoService health check failed");
            return HealthCheckResponse.ServingStatus.NOT_SERVING;
        }
    }

    /**
     * Check the health status of a specific service.
     * Returns the current serving status of the requested service.
     *
     * @param request The health check request containing the service name
     * @return A Uni containing the health check response with serving status
     */
    @RunOnVirtualThread
    @Override
    public Uni<HealthCheckResponse> check(HealthCheckRequest request) {
        logger.infof("Health check requested for service: %s", request.getService());

        try {
            String serviceName = request.getService();
            HealthCheckResponse.ServingStatus status = getServiceStatus(serviceName);

            HealthCheckResponse response = HealthCheckResponse.newBuilder()
                    .setStatus(status)
                    .build();

            logger.infof("Health check response: %s", status);
            return Uni.createFrom().item(response);
        } catch (Exception e) {
            logger.errorf(e, "Error during health check");
            return Uni.createFrom().failure(e);
        }
    }

    /**
     * Watch the health status of a specific service.
     * Returns a stream of health check responses that updates periodically.
     *
     * @param request The health check request containing the service name
     * @return A Multi (stream) of health check responses
     */
    @Override
    public Multi<HealthCheckResponse> watch(HealthCheckRequest request) {
        logger.infof("Health watch requested for service: %s", request.getService());

        String serviceName = request.getService();

        return Multi.createFrom().ticks().every(Duration.ofSeconds(5))
                .onItem().transform(tick -> {
                    HealthCheckResponse.ServingStatus status = getServiceStatus(serviceName);
                    logger.debugf("Health watch update for %s: %s", serviceName, status);
                    return HealthCheckResponse.newBuilder()
                            .setStatus(status)
                            .build();
                });
    }

    /**
     * Determine the serving status of a specific service.
     *
     * @param serviceName The name of the service to check
     * @return The serving status of the service
     */
    private HealthCheckResponse.ServingStatus getServiceStatus(String serviceName) {
        // Check if the service is running
        // Empty service name indicates the overall server health
        if (serviceName == null || serviceName.isEmpty()) return HealthCheckResponse.ServingStatus.SERVING;

        // Add service-specific health checks here
        return switch (serviceName) {
            case "com.drive.backend.grpc.service.FileInfoService" -> checkFileServiceHealth();
            case "com.drive.backend.grpc.service.UserService" -> checkUserServiceHealth();
            case "com.drive.backend.grpc.health.v1.Health" -> HealthCheckResponse.ServingStatus.SERVING;
            default -> {
                logger.warnf("Unknown service: %s", serviceName);
                yield HealthCheckResponse.ServingStatus.UNKNOWN;
            }
        };
    }

    /**
     * Check the health of the UserService.
     * You can add database checks, external service checks, etc.
     *
     * @return The serving status of the user service
     */
    private HealthCheckResponse.ServingStatus checkUserServiceHealth() {
        try {
            // Add your user service health checks here
            // For now, we assume it's healthy
            return HealthCheckResponse.ServingStatus.SERVING;
        } catch (Exception e) {
            logger.errorf(e, "UserService health check failed");
            return HealthCheckResponse.ServingStatus.NOT_SERVING;
        }
    }
}
