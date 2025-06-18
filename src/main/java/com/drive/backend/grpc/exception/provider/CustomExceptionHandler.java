package com.drive.backend.grpc.exception.provider;

import com.drive.backend.grpc.exception.CustomException;
import com.drive.backend.grpc.exception.dto.ErrorMessage;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * This class is a JAX-RS exception mapper that handles CustomException
 * and converts it into a standardized error response format.
 * It provides custom logic to handle the exception and return an appropriate response.
 */
@Provider
public class CustomExceptionHandler implements ExceptionMapper<CustomException> {
    @Override
    public Response toResponse(CustomException e) {
        // Custom logic to handle the exception
        return Response.status(Response.Status.BAD_REQUEST).entity(new ErrorMessage(e.getMessage(), false)).build();
    }
}