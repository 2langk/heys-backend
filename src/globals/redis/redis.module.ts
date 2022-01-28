import { CacheModule, CacheModuleOptions, DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static register(config: CacheModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [CacheModule.register(config)],
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
