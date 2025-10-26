import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'localhost');
        const redisPort = configService.get('REDIS_PORT', 6379);

        try {
          return {
            store: await redisStore({
              host: redisHost,
              port: redisPort,
              ttl: 60, // Default TTL in seconds
            }),
            ttl: 60,
            max: 1000, // Maximum number of items in cache
          };
        } catch (error) {
          // Fallback to memory cache if Redis is not available
          console.warn('Redis not available, using memory cache');
          return {
            ttl: 60,
            max: 1000,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
