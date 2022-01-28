import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService, RedisService } from 'src/globals';
import { EVICT_CACHE_KEY } from '../decorators/evict-cache.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { method, originalUrl } = context.switchToHttp().getRequest<Request>();
    const noneCacheUrls = ['/api/users/me'];

    if (method === 'GET') {
      const cache = await this.redisService.getOneByKey<any>(originalUrl);
      if (cache) {
        this.loggerService.logger.info(`[${method}] ${originalUrl} - from Cache`);
        return of({ isSuccess: true, fromCache: true, ...cache });
      } else {
        this.loggerService.logger.info(`[${method}] ${originalUrl} - from Database`);
        return next.handle().pipe(
          map((data) => {
            if (!noneCacheUrls.includes(originalUrl) && !originalUrl.includes('?')) {
              this.redisService.setOneByKey(originalUrl, data);
            }

            if (!data) data = {};
            return { isSuccess: true, fromCache: false, ...data };
          }),
        );
      }
    } else {
      this.loggerService.logger.info(`[${method}] ${originalUrl} - remove Cache`);
      return next.handle().pipe(
        map((data) => {
          const evictCache = this.reflector.getAllAndOverride<string>(EVICT_CACHE_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);

          if (evictCache) {
            this.redisService.removeOneByKey(originalUrl.split(evictCache)[0]); // TODO: 좀 더 직관적으로 사용할 수 있는 방법
          } else if (!noneCacheUrls.includes(originalUrl)) {
            this.redisService.removeOneByKey(originalUrl);
          }

          if (!data) data = {};
          return { isSuccess: true, fromCache: false, ...data };
        }),
      );
    }
  }
}

/**
 * 캐시 전략
 * - noneCacheUrls이 아니고 쿼리스트링이 없는 GET 요청은 originalUrl을 key로 전부 다 캐싱
 * - POST, PUT, DELETE 요청은 originalUrl을 key로 noneCacheUrls이 아니면 전부 다 캐시 삭제
 *
 * ** 예외 사항
 * - [POST, PUT, DELETE] /posts/1/likes의 경우 /posts/1의 캐시를 삭제해주지 못하고 있음
 * - 이런 경우 @EvictCache를 직접 호출해서 /posts/1의 캐시를 삭제함
 * - key로 split()에 필요한 값을 받는데, 개선해야할 필요가 있음
 */
