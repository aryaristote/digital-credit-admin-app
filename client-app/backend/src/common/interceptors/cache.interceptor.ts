import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../modules/cache/cache.service';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `http:${method}:${url}`;

    return new Observable((observer) => {
      // Try to get from cache
      this.cacheService.get(cacheKey).then((cached) => {
        if (cached) {
          observer.next(cached);
          observer.complete();
          return;
        }

        // If not cached, proceed with request
        next.handle().subscribe({
          next: (data) => {
            // Cache the response for 60 seconds
            this.cacheService.set(cacheKey, data, 60);
            observer.next(data);
          },
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
