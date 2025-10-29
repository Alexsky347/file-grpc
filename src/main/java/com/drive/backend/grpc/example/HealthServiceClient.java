package com.drive.backend.grpc.example;

import com.drive.backend.grpc.health.v1.Health;
import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckRequest;
import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckResponse;
import io.quarkus.grpc.GrpcClient;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Singleton;
import org.jboss.logging.Logger;

/**
 * Example of how to call the Health gRPC service. This demonstrates both the Check (unary) and
 * Watch (server streaming) RPC calls.
 */
@Singleton
public class HealthServiceClient {

  private static final Logger logger = Logger.getLogger(HealthServiceClient.class);

  @GrpcClient Health healthService;

  /**
   * Example: Call the Check method to get a single health status response.
   *
   * <p>Usage: @Inject HealthServiceClient client;
   *
   * <p>// In your method: client.checkHealth("com.drive.backend.grpc.service.FileInfoService")
   * .subscribe().with( response -> logger.infof("Service status: %s", response.getStatus()),
   * failure -> logger.errorf(failure, "Health check failed") );
   */
  public Uni<HealthCheckResponse> checkHealth(String serviceName) {
    logger.infof("Checking health of service: %s", serviceName);

    HealthCheckRequest request = HealthCheckRequest.newBuilder().setService(serviceName).build();

    return healthService.check(request);
  }

  /**
   * Example: Call the Watch method to get a continuous stream of health status updates. The stream
   * updates every 5 seconds.
   *
   * <p>Usage: @Inject HealthServiceClient client;
   *
   * <p>// In your method: client.watchHealth("com.drive.backend.grpc.service.FileInfoService")
   * .subscribe().with( response -> logger.infof("Service status update: %s", response.getStatus()),
   * failure -> logger.errorf(failure, "Health watch failed") );
   */
  public Multi<HealthCheckResponse> watchHealth(String serviceName) {
    logger.infof("Watching health of service: %s", serviceName);

    HealthCheckRequest request = HealthCheckRequest.newBuilder().setService(serviceName).build();

    return healthService.watch(request);
  }

  /**
   * Example: Check the overall server health (empty service name).
   *
   * <p>Usage: @Inject HealthServiceClient client;
   *
   * <p>// In your method: client.checkOverallHealth() .subscribe().with( response ->
   * logger.infof("Overall server status: %s", response.getStatus()), failure ->
   * logger.errorf(failure, "Overall health check failed") );
   */
  public Uni<HealthCheckResponse> checkOverallHealth() {
    logger.info("Checking overall server health");

    HealthCheckRequest request = HealthCheckRequest.newBuilder().setService("").build();

    return healthService.check(request);
  }
}
