import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Ensures ALL errors return the same shape: { statusCode, code, error, path, timestamp }.
// This is the contract the frontend depends on for its error-message mapping.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const code = (exceptionResponse as any)?.code ?? 'internal_error';
    const message =
      (exceptionResponse as any)?.message ??
      (exception instanceof Error
        ? exception.message
        : 'An unexpected error occurred');

    // Only log server-side failures; never echo user-facing messages into logs.
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        (exception as Error)?.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      code,
      error: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
