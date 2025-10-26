import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const threshold = 1000; // 1 second

          if (duration > threshold) {
            this.logger.warn(`Slow request: ${method} ${url} took ${duration}ms`);
          } else {
            this.logger.debug(`${method} ${url} took ${duration}ms`);
          }
        },
        error: () => {
          const duration = Date.now() - startTime;
          this.logger.error(`${method} ${url} failed after ${duration}ms`);
        },
      }),
    );
  }
}
