import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA = 'rate_limit';

/**
 * Rate limit decorator
 * @param limit Maximum number of requests
 * @param windowTime Window time in seconds
 */
export const RateLimit = (limit: number, windowTime: number = 60) => {
  return SetMetadata(RATE_LIMIT_METADATA, { limit, windowTime });
};
