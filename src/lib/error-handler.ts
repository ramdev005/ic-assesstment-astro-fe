import { ApiError } from "../types";

/**
 * Enhanced Error Handler for API responses
 */
export class ErrorHandler {
  /**
   * Convert an error to a user-friendly message
   */
  static getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      // Handle validation errors
      if (error.isValidationError()) {
        const validationErrors = error.getValidationErrors();
        if (validationErrors) {
          // Get the first validation error message
          const firstField = Object.keys(validationErrors)[0];
          const firstError = validationErrors[firstField]?.[0];
          return firstError || "Validation failed";
        }
      }

      // Handle client errors (4xx)
      if (error.isClientError()) {
        return error.message || "Invalid request";
      }

      // Handle server errors (5xx)
      if (error.isServerError()) {
        return "A server error occurred. Please try again later.";
      }

      return error.message;
    }

    // Handle regular errors
    if (error instanceof Error) {
      return error.message;
    }

    // Handle unknown errors
    if (typeof error === "string") {
      return error;
    }

    return "An unexpected error occurred";
  }

  /**
   * Get detailed error information for debugging
   */
  static getErrorDetails(error: unknown): {
    message: string;
    code?: number;
    status?: string;
    timestamp?: string;
    validationErrors?: Record<string, string[]>;
  } {
    const details = {
      message: this.getErrorMessage(error),
    } as any;

    if (error instanceof ApiError) {
      details.status = error.status;
      details.code = error.code;
      details.timestamp = error.timestamp;

      if (error.isValidationError()) {
        details.validationErrors = error.getValidationErrors();
      }
    }

    return details;
  }

  /**
   * Log error for debugging purposes
   */
  static logError(error: unknown, context?: string): void {
    const details = this.getErrorDetails(error);
    const contextMessage = context ? ` [${context}]` : "";

    console.error(`API Error${contextMessage}:`, details);

    // Log original error for stack trace
    if (error instanceof Error) {
      console.error("Original error:", error);
    }
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    return (
      error instanceof Error &&
      !error.hasOwnProperty("status") &&
      (error.message.includes("Network") ||
        error.message.includes("fetch") ||
        error.message.includes("timeout"))
    );
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: unknown): boolean {
    if (error instanceof ApiError) {
      // Don't retry client errors (4xx)
      if (error.isClientError()) {
        return false;
      }

      // Retry server errors (5xx)
      if (error.isServerError()) {
        return true;
      }
    }

    // Retry network errors
    return this.isNetworkError(error);
  }
}
