// Jest globals are available by default, no import needed
import { ErrorHandler } from '../error-handler';
import { ApiError, JSendStatus } from '../../types';

describe('ErrorHandler', () => {
  describe('getErrorMessage', () => {
    it('should return validation error message for ApiError with validation errors', () => {
      const apiError = new ApiError({
        status: JSendStatus.FAIL,
        data: {
          errors: {
            name: ['Name is required'],
            email: ['Email must be valid'],
          },
        },
      });

      const message = ErrorHandler.getErrorMessage(apiError);
      expect(message).toBe('Name is required');
    });

    it('should return error message for client error', () => {
      const apiError = new ApiError({
        status: JSendStatus.FAIL,
        data: {
          message: 'Invalid request data',
        },
      });

      const message = ErrorHandler.getErrorMessage(apiError);
      expect(message).toBe('Invalid request data');
    });

    it('should return generic message for server error', () => {
      const apiError = new ApiError({
        status: JSendStatus.ERROR,
        message: 'Internal server error',
        code: 5001,
      });

      const message = ErrorHandler.getErrorMessage(apiError);
      expect(message).toBe('A server error occurred. Please try again later.');
    });

    it('should return error message for regular Error', () => {
      const error = new Error('Something went wrong');
      const message = ErrorHandler.getErrorMessage(error);
      expect(message).toBe('Something went wrong');
    });

    it('should return string error as is', () => {
      const message = ErrorHandler.getErrorMessage('String error');
      expect(message).toBe('String error');
    });

    it('should return generic message for unknown error', () => {
      const message = ErrorHandler.getErrorMessage({ unknown: 'error' });
      expect(message).toBe('An unexpected error occurred');
    });
  });

  describe('getErrorDetails', () => {
    it('should return detailed error information for ApiError', () => {
      const apiError = new ApiError({
        status: JSendStatus.ERROR,
        message: 'Server error',
        code: 5001,
        data: {
          timestamp: '2023-01-01T00:00:00Z',
        },
      });

      const details = ErrorHandler.getErrorDetails(apiError);

      expect(details).toEqual({
        message: 'A server error occurred. Please try again later.',
        status: JSendStatus.ERROR,
        code: 5001,
        timestamp: '2023-01-01T00:00:00Z',
      });
    });

    it('should include validation errors for validation error', () => {
      const apiError = new ApiError({
        status: JSendStatus.FAIL,
        data: {
          errors: {
            name: ['Name is required'],
          },
        },
      });

      const details = ErrorHandler.getErrorDetails(apiError);

      expect(details.validationErrors).toEqual({
        name: ['Name is required'],
      });
    });
  });

  describe('logError', () => {
    it('should log error details to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      ErrorHandler.logError(error, 'test context');

      expect(consoleSpy).toHaveBeenCalledWith(
        'API Error [test context]:',
        expect.objectContaining({
          message: 'Test error',
        })
      );
      expect(consoleSpy).toHaveBeenCalledWith('Original error:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('isNetworkError', () => {
    it('should identify network errors', () => {
      const networkError = new Error('Network timeout');
      expect(ErrorHandler.isNetworkError(networkError)).toBe(true);

      const fetchError = new Error('fetch failed');
      expect(ErrorHandler.isNetworkError(fetchError)).toBe(true);

      const apiError = new ApiError({
        status: JSendStatus.ERROR,
        message: 'Server error',
      });
      expect(ErrorHandler.isNetworkError(apiError)).toBe(false);
    });
  });

  describe('isRetryableError', () => {
    it('should not retry client errors', () => {
      const clientError = new ApiError({
        status: JSendStatus.FAIL,
        data: { message: 'Bad request' },
      });

      expect(ErrorHandler.isRetryableError(clientError)).toBe(false);
    });

    it('should retry server errors', () => {
      const serverError = new ApiError({
        status: JSendStatus.ERROR,
        message: 'Internal server error',
      });

      expect(ErrorHandler.isRetryableError(serverError)).toBe(true);
    });

    it('should retry network errors', () => {
      const networkError = new Error('Network timeout');
      expect(ErrorHandler.isRetryableError(networkError)).toBe(true);
    });
  });
});
