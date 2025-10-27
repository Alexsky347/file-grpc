package com.drive.backend.grpc.exception.mapper;

import com.drive.backend.grpc.exception.data.EntityResponse;
import io.quarkus.logging.Log;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.UUID;

/**
 * This class is a JAX-RS exception mapper that handles all uncaught exceptions
 * and converts them into a standardized error response format.
 * It generates a unique error ID for each error and logs the error details.
 */
@Provider
public class ThrowableMapper implements ExceptionMapper<Throwable> {
    private static String getErrorMessage() {
        try {
            return ResourceBundle.getBundle("ValidationMessages").getString("System.error");
        } catch (MissingResourceException e) {
            Log.warn("ValidationMessages resource bundle not found, using fallback message", e);
            return "An unexpected error occurred. Please contact support with the error ID.";
        }
    }

    @Override
    public Response toResponse(Throwable e) {
        // TODO to change
        String errorId = UUID.randomUUID().toString();
        Log.error("errorId[{}]", errorId, e);
        String defaultErrorMessage = getErrorMessage();
        EntityResponse entityResponse = new EntityResponse(errorId, defaultErrorMessage, false);
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(entityResponse).build();
    }
}