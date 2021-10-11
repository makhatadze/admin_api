import { applyDecorators, SetMetadata } from '@nestjs/common';
import { API_AUTH_KEY } from '../constants';

/**
 * @constructor
 */
export function ApiAuth() {
  return applyDecorators(SetMetadata(API_AUTH_KEY, true));
}
