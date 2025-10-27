package com.drive.backend.grpc.exception.provider;

import com.drive.backend.grpc.exception.CustomRunTimeException;
import com.drive.backend.grpc.exception.data.EntityMessage;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * This class is a JAX-RS exception mapper that handles CustomException
 * and converts it into a standardized error response format.
 * It provides custom logic to handle the exception and return an appropriate response.
 */
@Provider
public class CustomExceptionHandler implements ExceptionMapper<CustomRunTimeException> {
    @Override
    public Response toResponse(CustomRunTimeException e) {
        // Custom logic to handle the exception
        return Response.status(Response.Status.BAD_REQUEST).entity(new EntityMessage(e.getMessage(), false)).build();
    }
}