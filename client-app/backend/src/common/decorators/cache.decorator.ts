import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * Cache decorator for caching method results
 * @param ttl Time to live in seconds (default: 60)
 * @param key Optional custom cache key
 */
export const Cache = (ttl: number = 60, key?: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    if (key) {
      SetMetadata(CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
    }
  };
};

/**
 * Cache user-specific data
 */
export const CacheUser = (ttl: number = 300) => Cache(ttl);

/**
 * Cache public data (longer TTL)
 */
export const CachePublic = (ttl: number = 3600) => Cache(ttl);

/**
 * Cache for frequently accessed data
 */
export const CacheFrequent = (ttl: number = 60) => Cache(ttl);
