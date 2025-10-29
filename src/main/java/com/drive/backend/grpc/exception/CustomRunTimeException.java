package com.drive.backend.grpc.exception;

import java.io.Serial;

/**
 * Custom exception class for handling specific application errors. This class extends
 * RuntimeException and provides several constructors to create exceptions with different levels of
 * detail.
 */
public class CustomRunTimeException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public CustomRunTimeException() {}

  public CustomRunTimeException(String message) {
    super(message);
  }

  public CustomRunTimeException(String message, Throwable cause) {
    super(message, cause);
  }

  public CustomRunTimeException(Throwable cause) {
    super(cause);
  }

  public CustomRunTimeException(
      String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
