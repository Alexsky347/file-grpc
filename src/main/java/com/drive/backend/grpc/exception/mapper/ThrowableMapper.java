package com.drive.backend.grpc.exception.mapper;

import com.drive.backend.grpc.exception.dto.ErrorResponse;
import io.quarkus.logging.Log;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.ResourceBundle;
import java.util.UUID;

/**
 * This class is a JAX-RS exception mapper that handles all uncaught exceptions
 * and converts them into a standardized error response format.
 * It generates a unique error ID for each error and logs the error details.
 */
@Provider
public class ThrowableMapper implements ExceptionMapper<Throwable> {
    @Override
    public Response toResponse(Throwable e) {
        String errorId = UUID.randomUUID().toString();
        Log.error("errorId[{}]", errorId, e);
        String defaultErrorMessage = ResourceBundle.getBundle("ValidationMessages").getString("System.error");
        ErrorResponse.ErrorMessage errorMessage = new ErrorResponse.ErrorMessage(defaultErrorMessage);
        ErrorResponse errorResponse = new ErrorResponse(errorId, errorMessage);
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).build();
    }
}