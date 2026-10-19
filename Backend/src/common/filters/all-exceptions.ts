import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Express middleware (body-parser...) throws its own errors, not HttpException.
 * They carry `status` and `expose` (true = safe to show the message to the client).
 */
interface ExpressClientError extends Error {
  status: number;
  expose: true;
}

function isExpressClientError(error: unknown): error is ExpressClientError {
  return (
    error instanceof Error &&
    'status' in error &&
    'expose' in error &&
    error.expose === true &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 500
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // originalUrl is never shortened by the router; cut the query so secrets stay out.
    const path = request.originalUrl.split('?')[0];

    const requestId =
      (request as Request & { id?: string | number }).id ?? 'unknown';

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : ((exceptionResponse as { message?: string | string[] }).message ??
            exception.message);
      error = exception.name;
    } else if (isExpressClientError(exception)) {
      status = exception.status;
      message = exception.message;
      error = exception.name;
    }

    const hideQuery = (text: string) =>
      request.originalUrl === path
        ? text
        : text.split(request.originalUrl).join(path);
    message = Array.isArray(message)
      ? message.map(hideQuery)
      : hideQuery(message);

    if (status >= 500) {
      this.logger.error(
        `[requestId=${requestId}] ${request.method} ${path} failed`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      requestId,
      message,
      error,
    });
  }
}
