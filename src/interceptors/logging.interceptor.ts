import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const requestStart = Date.now();

    // Simple request log - NO object serialization
    this.logger.log(`🚀 ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - requestStart;
          this.logger.log(
            `✅ ${method} ${url} - ${response.statusCode} - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - requestStart;
          this.logger.error(
            `❌ ${method} ${url} - ${response.statusCode || 500} - ${responseTime}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
