import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ICurrentUserType } from '@src/decorators/current.user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { AccountRoleEntity } from '../../../admin/system/account/entities/account.role.entity';
import { AccessEntity } from '../../../admin/system/access/entities/access.entity';
import { RoleAccessEntity } from '../../../admin/system/role/entities/role.access.entity';

@Injectable()
export class ApiAuthService {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}

  /**
   * @Description: Intercept api
   * @param {ICurrentUserType} user
   * @param {string} method
   * @param {string} url
   * @return {*}
   */
  public async apiAuth(user: ICurrentUserType, method: string, url: string): Promise<boolean> {
    const { isSuper, id } = user;
    // 1.如果是超级管理员就直接返回true
    if (isSuper) {
      return true;
    } else {
      // 2.Get the role id owned by the current account according to the current account id
      // const authRoleList: Pick<AccountRoleEntity, 'roleId'>[] =
      //   await this.accountRoleRepository.find({
      //     where: { accountId: id },
      //     select: ['roleId'],
      //   });
      // console.log(authRoleList, '333');
      // const authRoleIdList: number[] = authRoleList.map(
      //   (item: Pick<AccountRoleEntity, 'roleId'>) => item.roleId,
      // );
      // console.log(authRoleIdList, 'List of authorized roles 44');
      // Query the intermediate table directly based on the account id, reducing one query
      const authRoleIdList: number[] = await this.accountRoleRepository
        .find({
          where: { accountId: id },
          select: ['roleId'],
        })
        .then((response: Pick<AccountRoleEntity, 'roleId'>[]) =>
          response.map((item: Pick<AccountRoleEntity, 'roleId'>) => item.roleId),
        );
      if (!authRoleIdList.length) {
        throw new HttpException(
          `No operation on current account:${method}-${url} permission`,
          HttpStatus.OK,
        );
      }
      // 3.根据角色ID列表获取当前账号拥有的资源id
      const authAccessList: Pick<RoleAccessEntity, 'accessId' | 'type'>[] | undefined =
        await getConnection()
          .createQueryBuilder(RoleAccessEntity, 'role_access')
          .select(['role_access.accessId', 'role_access.type'])
          .where('role_access.roleId in (:...roleId)', { roleId: authRoleIdList })
          .getMany();
      console.log(authAccessList, 'List of authorized resources 55'); // [ RoleAccessEntity { accessId: 5, type: 3 } ]
      const formatUrl = this.formatUrl(method, url);
      // 4.根据请求方式和路径去查询数据
      const accessResult: Pick<AccessEntity, 'id' | 'type'> | undefined =
        await this.accessRepository.findOne({
          where: { method, url: formatUrl },
          select: ['id', 'type'],
        });
      console.log(accessResult, 'Currently requested resource 66');
      const isExist = authAccessList.find(
        (item: Pick<RoleAccessEntity, 'accessId' | 'type'>) =>
          item.accessId === accessResult?.id && Number(item.type) === Number(accessResult?.type),
      );
      if (isExist) {
        return true;
      } else {
        throw new HttpException(
          `No operation on current account:${method}-${url} permission`,
          HttpStatus.OK,
        );
      }
    }
  }

  /**
   *
   * @param method
   * @param url
   * @private
   */
  private formatUrl(method: string, url: string): string {
    switch (method) {
      case 'GET':
        // Remove the question mark
        return url.substring(0, url.indexOf('?'));
      case 'DELETE':
      case 'PATCH':
      case 'PUT':
        // The last url is changed to * wildcard
        return url.replace(/(.*?\/)\d+$/, '$1*');
      default:
        return url;
    }
  }
}
