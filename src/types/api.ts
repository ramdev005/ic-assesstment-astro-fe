/**
 * JSEND Response Types for Frontend
 * Based on JSEND specification: https://github.com/omniti-labs/jsend
 */

export enum JSendStatus {
  SUCCESS = "success",
  FAIL = "fail",
  ERROR = "error",
}

export interface JSendSuccessResponse<T = any> {
  status: JSendStatus.SUCCESS;
  data: T;
}

export interface JSendFailResponse {
  status: JSendStatus.FAIL;
  data: {
    message?: string;
    errors?: Record<string, string[]>;
    [key: string]: any;
  };
}

export interface JSendErrorResponse {
  status: JSendStatus.ERROR;
  message: string;
  code?: number;
  data?: {
    timestamp?: string;
    path?: string;
    method?: string;
    [key: string]: any;
  };
}

export type JSendResponse<T = any> =
  | JSendSuccessResponse<T>
  | JSendFailResponse
  | JSendErrorResponse;

/**
 * API Error class for handling JSEND error responses
 */
export class ApiError extends Error {
  public readonly status: JSendStatus;
  public readonly code?: number;
  public readonly data?: Record<string, any>;
  public readonly timestamp?: string;

  constructor(response: JSendFailResponse | JSendErrorResponse) {
    const message =
      response.status === JSendStatus.ERROR
        ? response.message
        : response.data.message || "An error occurred";

    super(message);
    this.name = "ApiError";
    this.status = response.status;

    if (response.status === JSendStatus.ERROR) {
      this.code = response.code;
      this.data = response.data;
      this.timestamp = response.data?.timestamp;
    } else {
      this.data = response.data;
    }
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.status === JSendStatus.FAIL && !!this.data?.errors;
  }

  /**
   * Get validation errors
   */
  getValidationErrors(): Record<string, string[]> | null {
    if (!this.isValidationError()) {
      return null;
    }
    return this.data?.errors || null;
  }

  /**
   * Check if error is a server error
   */
  isServerError(): boolean {
    return this.status === JSendStatus.ERROR;
  }

  /**
   * Check if error is a client error
   */
  isClientError(): boolean {
    return this.status === JSendStatus.FAIL;
  }
}
