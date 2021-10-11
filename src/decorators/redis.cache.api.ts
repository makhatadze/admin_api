import { applyDecorators, SetMetadata } from '@nestjs/common';
import { REDIS_CACHE_KEY, REDIS_CACHE_EX_SECOND_KEY } from '../constants';
import redisCacheConfig from '../config/redisCache.config';

// 是否缓存
const isCache = true;

/**
 * @Description: Custom decorator, used to decorate the interface that needs to be cached on the route
 * @param {number} exSecond Redis cache expiration time, time is wonderful
 * @return {*}
 */
export function RedisCacheApi(exSecond: number = redisCacheConfig.redisEXSecond): any {
  return applyDecorators(
    SetMetadata(REDIS_CACHE_KEY, isCache),
    SetMetadata(REDIS_CACHE_EX_SECOND_KEY, exSecond),
  );
}
