package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.health.v1.HealthOuterClass.HealthCheckRequest;
import com.drive.backend.grpc.service.HealthService;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.jboss.logging.Logger;

/**
 * REST endpoint to expose Health gRPC service via HTTP. This allows HTTP clients to check the
 * health status of services.
 */
@Path("/internal/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {

  private static final Logger logger = Logger.getLogger(HealthResource.class);

  @Inject @GrpcService HealthService healthService;

  /**
   * Check the health status of a specific service.
   *
   * <p>Example requests: GET
   * /api/health/check?service=com.drive.backend.grpc.service.FileInfoService GET /api/health/check
   * (checks overall server health)
   *
   * @param service The service name to check (optional)
   * @return Health check response with serving status
   */
  @GET
  @Path("/check")
  public Uni<HealthResponse> checkHealth(@QueryParam("service") String service) {

    logger.infof(
        "HTTP health check request for service: %s", service != null ? service : "overall");

    String serviceName = service != null ? service : "";

    HealthCheckRequest request = HealthCheckRequest.newBuilder().setService(serviceName).build();

    return healthService
        .check(request)
        .map(response -> new HealthResponse(response.getStatus().name()));
  }

  /**
   * Simple HTTP endpoint for basic liveness probe. Returns 200 OK if the server is running.
   *
   * <p>Example request: GET /api/health/live
   *
   * @return OK status
   */
  @GET
  @Path("/live")
  public String liveness() {
    logger.info("Liveness probe called");
    return "{\"status\": \"UP\"}";
  }

  /**
   * Simple HTTP endpoint for readiness probe. Returns 200 OK if the server is ready to accept
   * requests.
   *
   * <p>Example request: GET /api/health/ready
   *
   * @return OK status
   */
  @GET
  @Path("/ready")
  public String readiness() {
    logger.info("Readiness probe called");
    return "{\"status\": \"READY\"}";
  }

  /** Simple POJO for health check response to enable JSON serialization. */
  public static class HealthResponse {
    public String status;

    HealthResponse(String status) {
      this.status = status;
    }
  }
}
