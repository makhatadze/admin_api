import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { getUrlQuery } from '@src/utils';
import { CodeEnum, CodeMessage } from '../../enums';
import { API_AUTH_KEY } from '@src/constants';
import { ApiAuthService } from '@src/modules/shared/services/api-auth/api-auth.service';
import { AccountTokenEntity } from '@src/modules/admin/system/account/entities/account.token.entity';
import moment from 'moment';
import { ICurrentUserType } from '@src/decorators/current.user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly apiAuthService: ApiAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      context.switchToRpc().getData().headers.token ||
      context.switchToHttp().getRequest().body.token ||
      getUrlQuery(request.url, 'token');
    Logger.log(`Current token: ${token}`, 'AuthGuard');
    const methodAuth = Reflect.getMetadata(API_AUTH_KEY, context.getHandler());
    const classAuth = Reflect.getMetadata(API_AUTH_KEY, context.getClass());
    console.log(methodAuth, classAuth, 'Guarding', request.method, request.url);
    if (token) {
      try {
        // 1.Query whether there is a record from the database
        const accountInfo: Extract<AccountTokenEntity, ICurrentUserType> | undefined =
          await AccountTokenEntity.findOne({
            where: { token },
            select: ['userId', 'username', 'mobile', 'expireTime', 'platform', 'email', 'isSuper'],
          });
        const isExpire: boolean = moment(accountInfo?.expireTime).isAfter(new Date());
        console.log(isExpire, 'Is it expired');
        if (accountInfo && isExpire) {
          const user: ICurrentUserType = {
            ...accountInfo,
            id: accountInfo.userId,
          };
          request.user = accountInfo;
          if (methodAuth || classAuth) {
            const method = request.method;
            const url = request.url;
            return this.apiAuthService.apiAuth(user, method, url);
          } else {
            return true;
          }
        } else {
          throw new HttpException(
            JSON.stringify({
              code: CodeEnum.TOKEN_ERROR,
              message: CodeMessage[CodeEnum.TOKEN_ERROR],
            }),
            HttpStatus.OK,
          );
        }
      } catch (e) {
        Logger.error(e, 'auth');
        throw new HttpException(e, e.status);
      }
    } else {
      throw new HttpException(
        JSON.stringify({
          code: CodeEnum.NO_TOKEN,
          message: CodeMessage[CodeEnum.NO_TOKEN],
        }),
        HttpStatus.OK,
      );
    }
  }
}
