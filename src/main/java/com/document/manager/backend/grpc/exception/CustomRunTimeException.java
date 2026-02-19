package com.document.manager.backend.grpc.exception;

import java.io.Serial;

/**
 * Custom exception class for handling specific application errors. This class extends
 * RuntimeException and provides several constructors to create exceptions with different levels of
 * detail.
 */
public class CustomRunTimeException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public CustomRunTimeException() {}

  public CustomRunTimeException(final String message) {
    super(message);
  }

  public CustomRunTimeException(final String message, final Throwable cause) {
    super(message, cause);
  }

  public CustomRunTimeException(final Throwable cause) {
    super(cause);
  }

  public CustomRunTimeException(
          final String message, final Throwable cause, final boolean enableSuppression, final boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
