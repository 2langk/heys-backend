import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOneByKey<T>(key: string) {
    const cache = await this.cacheManager.get<T>(key);
    return cache;
  }

  async setOneByKey(key: string, record: any) {
    const cache = await this.cacheManager.set(key, record);
    return cache;
  }

  async removeOneByKey(key: string) {
    await this.cacheManager.del(key);
  }
}
