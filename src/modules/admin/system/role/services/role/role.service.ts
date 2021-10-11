import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { Repository, getConnection, ILike, Equal } from 'typeorm';
import { CreateRoleDto } from '../../controllers/role/dto/create.role.dto';
import { UpdateRoleDto } from '../../controllers/role/dto/update.role.dto';
import { RoleListVo, RoleVo } from '../../controllers/role/vo/role.vo';
import { RoleReqDto } from '../../controllers/role/dto/role.req.dto';
import { PageEnum, StatusEnum } from '../../../../../../enums';
import { RoleEnum } from '@src/enums';
import { AccountRoleEntity } from '../../../account/entities/account.role.entity';
import { mapToObj } from '@src/utils';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
  ) {}

  /**
   * @Description: Creating a Role
   * @param {CreateRoleDto} createRoleDto
   * @return {*}
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<string> {
    const { name, isDefault } = createRoleDto;
    const findNameResult: Pick<RoleEntity, 'id'> | undefined = await this.roleRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (findNameResult) {
      throw new HttpException(
        `${name}The current role already exists and cannot be created repeatedly`,
        HttpStatus.OK,
      );
    }
    // If it is the default role, judge it
    if (Object.is(isDefault, RoleEnum.DEFAULT)) {
      const findDefault: Pick<RoleEntity, 'id'> | undefined = await this.roleRepository.findOne({
        where: { isDefault },
        select: ['id'],
      });
      if (findDefault) {
        throw new HttpException(
          'Existing default roles cannot be created repeatedly',
          HttpStatus.OK,
        );
      }
    }
    const role: RoleEntity = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return 'Role created successfully';
  }

  /**
   * @Description: Delete roles based on role id
   * @param {number} id
   * @return {*}
   */
  async destroyRoleById(id: number): Promise<string> {
    // Determine whether the current role is already occupied (the role is bound to an account)
    const accountRoleFindResult: Pick<AccountRoleEntity, 'id'> | undefined =
      await this.accountRoleRepository.findOne({
        where: { roleId: id },
        select: ['id'],
      });
    if (accountRoleFindResult) {
      throw new HttpException(
        'The current role has an account bound to it and cannot be deleted directly',
        HttpStatus.OK,
      );
    }
    const {
      raw: { affectedRows },
    } = await this.roleRepository.softDelete(id);
    if (affectedRows) {
      return 'successfully deleted';
    } else {
      return 'failed to delete';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:26:46
   * @LastEditors: 水痕
   * @Description: 根据角色id修改角色
   * @param {number} id
   * @param {UpdateRoleDto} updateRoleDto
   * @return {*}
   */
  async modifyRoleById(id: number, updateRoleDto: UpdateRoleDto): Promise<string> {
    const { isDefault } = updateRoleDto;
    if (Object.is(isDefault, String(RoleEnum.DEFAULT))) {
      const findResult = await this.roleRepository.findOne({
        where: { isDefault },
        select: ['id'],
      });
      if (findResult?.id !== id) {
        throw new HttpException('默认角色只能有一个', HttpStatus.OK);
      }
    }
    const {
      raw: { affectedRows },
    } = await this.roleRepository.update(id, updateRoleDto);
    if (affectedRows) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:40:13
   * @LastEditors: 水痕
   * @Description: 根据角色id查询角色
   * @param {number} id
   * @return {*}
   */
  async roleById(id: number): Promise<RoleVo | undefined> {
    return await this.roleRepository.findOne(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:46:45
   * @LastEditors: 水痕
   * @Description: 查询角色列表
   * @param {RoleReqDto} roleReqDto
   * @return {*}
   */
  async roleList(roleReqDto: RoleReqDto): Promise<RoleListVo> {
    const {
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      name,
      status,
    } = roleReqDto;
    const query = new Map();
    if (name) {
      query.set('name', ILike(name));
    }
    if ([StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(Number(status))) {
      query.set('status', Equal(status));
    }
    const [data, total] = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where(mapToObj(query))
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageSize,
      pageNumber,
    };
  }
}
