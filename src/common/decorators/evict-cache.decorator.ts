import { SetMetadata } from '@nestjs/common';

export const EVICT_CACHE_KEY = 'evictCache';

export const EvictCache = (key: string) => SetMetadata(EVICT_CACHE_KEY, key);
