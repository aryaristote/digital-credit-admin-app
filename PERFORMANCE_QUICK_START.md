# Performance & Caching Quick Start

Quick reference for performance optimizations and caching.

---

## 🚀 Quick Setup

### Install Dependencies

```bash
cd client-app/backend
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store compression
```

### Enable Redis

Make sure Redis is running:

```bash
redis-server
```

---

## 💡 Usage Examples

### 1. Cache Decorator

```typescript
import { CachePublic } from '../common/decorators/cache.decorator';

@Get('stats')
@CachePublic(900) // Cache for 15 minutes
async getStats() {
  return this.analyticsService.getStats();
}
```

### 2. Rate Limiting

```typescript
import { RateLimit } from '../common/decorators/rate-limit.decorator';

@Post('login')
@RateLimit(5, 60) // 5 requests per minute
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

### 3. Cache Service

```typescript
import { CacheService } from "../modules/cache/cache.service";

// Get or set pattern
const user = await this.cacheService.getOrSet(
  "user:123",
  () => this.repository.findById("123"),
  300 // 5 minutes
);

// Invalidate cache
await this.cacheService.del("user:123");
```

---

## 📊 Cache TTL Guidelines

| Data Type       | TTL    | Reason              |
| --------------- | ------ | ------------------- |
| User Data       | 5 min  | Frequently updated  |
| Credit Requests | 2 min  | Status changes      |
| Savings Balance | 1 min  | Transaction updates |
| Analytics       | 15 min | Rarely changes      |

---

## 🚦 Rate Limits

| Endpoint | Limit    | Window |
| -------- | -------- | ------ |
| Login    | 5/min    | 60s    |
| API      | 100/min  | 60s    |
| Public   | 1000/min | 60s    |

---

## 📚 Full Documentation

See [PERFORMANCE_CACHING.md](PERFORMANCE_CACHING.md) for complete guide.
