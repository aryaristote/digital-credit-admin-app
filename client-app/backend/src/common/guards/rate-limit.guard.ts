import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_METADATA } from '../decorators/rate-limit.decorator';
import { CacheService } from '../../modules/cache/cache.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rateLimitConfig = this.reflector.get(RATE_LIMIT_METADATA, context.getHandler());

    // Default rate limit if not specified
    const { limit = 100, windowTime = 60 } = rateLimitConfig || {};

    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const key = `rate_limit:${ip}:${request.url}`;

    try {
      const current = await this.cacheService.increment(key);

      if (current === 1) {
        await this.cacheService.set(key, 1, windowTime);
      }

      if (current > limit) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Too many requests. Limit: ${limit} per ${windowTime}s`,
            retryAfter: windowTime,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // If rate limiting fails, allow request (fail open)
      return true;
    }
  }
}
