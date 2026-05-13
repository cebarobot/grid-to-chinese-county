import { LocatorParseError } from '@grid-to-xian/core';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiErrorResponse {
  statusCode: number;
  payload: ApiErrorPayload;
}

export class RequestValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

export function mapErrorToApiError(error: unknown): ApiErrorResponse {
  if (error instanceof RequestValidationError) {
    return {
      statusCode: 400,
      payload: {
        error: {
          code: 'INVALID_REQUEST',
          message: error.message
        }
      }
    };
  }

  if (error instanceof LocatorParseError) {
    return {
      statusCode: 400,
      payload: {
        error: {
          code: error.code,
          message: error.message
        }
      }
    };
  }

  return {
    statusCode: 500,
    payload: {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected server error.'
      }
    }
  };
}
