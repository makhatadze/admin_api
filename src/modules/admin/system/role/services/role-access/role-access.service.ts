import { AccessEntity } from '../../../access/entities/access.entity';
import { AccessTypeEnum } from '@src/enums';
import { RoleAccessEntity } from '../../entities/role.access.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { RoleAccessReqDto } from '../../controllers/role-access/dto/role.access.req.dto';
import { AllApiVo } from '../../controllers/role-access/vo/all.api.vo';
import { AllMenusVo } from '../../controllers/role-access/vo/all.menus.vo';
import { RoleAccessVo } from '../../controllers/role-access/vo/role.access.vo';

@Injectable()
export class RoleAccessService {
  constructor(
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}

  /**
   * @Description: Authorize menu and interface permissions for the current role ID
   * @return {*}
   * @param roleId
   * @param roleAccessReqDto
   */
  async roleToAccess(roleId: number, roleAccessReqDto: RoleAccessReqDto): Promise<string> {
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        const { accessList, type } = roleAccessReqDto;
        await entityManager.delete<RoleAccessEntity>(RoleAccessEntity, {
          roleId,
          type,
        });
        const newAccessList = accessList.map((item: number) => {
          return {
            roleId,
            type,
            accessId: item,
          };
        });
        const result = entityManager.create<RoleAccessEntity>(RoleAccessEntity, newAccessList);
        await entityManager.save<RoleAccessEntity>(result);
      })
      .then(() => {
        return 'Assign menu permissions successfully';
      })
      .catch((e: HttpException) => {
        throw new HttpException(e, HttpStatus.OK);
      });
  }

  /**
   * @Description: Get all the menus, licensable
   * @return {*}
   */
  async allMenus(): Promise<AllMenusVo[]> {
    const menusList: Pick<AccessEntity, 'id' | 'moduleName' | 'actionName' | 'parentId'>[] =
      await this.accessRepository.find({
        where: [{ type: AccessTypeEnum.MODULE }, { type: AccessTypeEnum.MENUS }],
        select: ['id', 'moduleName', 'actionName', 'parentId'],
        order: { sort: 'ASC', createdAt: 'DESC' },
      });
    return menusList.map(
      (item: Pick<AccessEntity, 'id' | 'moduleName' | 'actionName' | 'parentId'>) => {
        return {
          id: item.id,
          key: String(item.id),
          title: item.moduleName ? item.moduleName : item.actionName,
          parentId: item.parentId,
        };
      },
    );
  }

  /**
   * @Description: Get all API
   * @return {*}
   */
  async allApi(): Promise<AllApiVo[]> {
    return await this.accessRepository.find({
      where: { type: AccessTypeEnum.OPERATION },
      select: ['id', 'apiName'],
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  /**
   * @Description: Return a list of authorized resources based on role id
   * @return {*}
   */
  async accessListByRoleId(roleId: number, type: number): Promise<RoleAccessVo[]> {
    return await this.roleAccessRepository.find({
      where: { roleId, type },
      select: ['id', 'accessId'],
    });
  }
}
