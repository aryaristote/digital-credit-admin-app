import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return cached value', async () => {
      mockCacheManager.get.mockResolvedValue('cached-value');

      const result = await service.get('test-key');

      expect(result).toBe('cached-value');
      expect(mockCacheManager.get).toHaveBeenCalledWith('test-key');
    });

    it('should return undefined on error', async () => {
      mockCacheManager.get.mockRejectedValue(new Error('Cache error'));

      const result = await service.get('test-key');

      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      await service.set('test-key', 'test-value', 60);

      expect(mockCacheManager.set).toHaveBeenCalledWith('test-key', 'test-value', 60);
    });
  });

  describe('increment', () => {
    it('should increment counter', async () => {
      mockCacheManager.get.mockResolvedValue(5);

      const result = await service.increment('counter-key');

      expect(result).toBe(6);
    });

    it('should start at 1 if key does not exist', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);

      const result = await service.increment('counter-key');

      expect(result).toBe(1);
    });
  });
});
