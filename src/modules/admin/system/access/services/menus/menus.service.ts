import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessEntity } from '../../entities/access.entity';
import { Repository, getConnection } from 'typeorm';
import { MenusListVo } from '../../controllers/menus/vo/menus.vo';
import { ICurrentUserType } from '@src/decorators/current.user';
import { AdminIdentityEnum, AccessTypeEnum } from '../../../../../../enums';
import { AccountRoleEntity } from '../../../account/entities/account.role.entity';
import { RoleAccessEntity } from '../../../role/entities/role.access.entity';

interface IAccessList {
  id: number;
  moduleName: string;
  actionName: string;
  parentId: number;
  url: string;
  sort: number;
  icon: string;
}

@Injectable()
export class MenusService {
  private readonly logger: Logger = new Logger(MenusService.name);

  constructor(
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>
  ) {
  }

  /**
   * @Description: List menu
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async menusList(userInfo: ICurrentUserType): Promise<MenusListVo[]> {
    /**
     * Return to the menu based on user permissions
     * 1.Query all menus
     * 2.If it is a super administrator, return to all menus
     * 3.Non-super administrators, according to the role of the current user to query the (role resource) table to obtain all resources
     */
    const { id, isSuper } = userInfo;
    // Super administrators will return all
    if (Object.is(isSuper, AdminIdentityEnum.SUPPER)) {
      // 1.Query all menus (modules and menus)
      const accessList: AccessEntity[] = await this.accessRepository.find({
        where: [
          { type: AccessTypeEnum.MODULE },
          { type: AccessTypeEnum.MENUS }
        ]
      });
      // 1.1 Format menu
      return this.formatMenus(accessList);
    } else {
      // 2.Query authorized roles based on the current account id
      const authRoleList: Pick<AccountRoleEntity, 'roleId'>[] =
        await this.accountRoleRepository.find({
          where: { accountId: id },
          select: ['roleId'],
        });
      const authRoleIdList: number[] = authRoleList.map(
        (item: Pick<AccountRoleEntity, 'roleId'>) => item.roleId,
      );
      console.log(authRoleList, 'List of authorized roles', authRoleIdList);
      // 3.Get the resource id owned by the current account according to the list of role IDs
      const authAccessList: Pick<RoleAccessEntity, 'accessId'>[] =
        await getConnection()
          .createQueryBuilder(RoleAccessEntity, 'role_access')
          .select(['role_access.accessId'])
          .where(
            'role_access.roleId in (:...roleId) and role_access.type = 2',
            {
              roleId: authRoleIdList,
            },
          )
          .getMany();
      this.logger.log('授权的资源列表', authAccessList); // [ RoleAccessEntity { accessId: 5 } ]
      const authAccessIdList: number[] = authAccessList.map(
        (item: Pick<RoleAccessEntity, 'accessId'>) => item.accessId,
      );
      // 4.According to the resource id to query the menu and format the return
      const accessList: Extract<AccessEntity, IAccessList>[] =
        await getConnection()
          .createQueryBuilder(AccessEntity, 'access')
          .select([
            'access.id',
            'access.moduleName',
            'access.actionName',
            'access.parentId',
            'access.url',
            'access.sort',
            'access.icon',
          ])
          .where(
            '(access.id in (:...authAccessIdList) and (access.type = 1 or access.type = 2))',
            {
              authAccessIdList,
            },
          )
          .getMany();
      return this.formatMenus(accessList);
    }
  }

  /**
   * @Description: Format back to the menu
   * @param {AccessEntity} accessList
   * @return {*}
   */
  private formatMenus(accessList: IAccessList[]): MenusListVo[] {
    return accessList.map((item: IAccessList) => {
      const { id, moduleName, actionName, parentId, url, sort, icon } = item;
      return {
        id,
        name: moduleName ? moduleName : actionName,
        parentId,
        url,
        sort,
        icon
      };
    });
  }
}
