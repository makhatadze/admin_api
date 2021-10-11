import { RoleEntity } from '../../../role/entities/role.entity';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRoleEntity } from '../../entities/account.role.entity';
import { Repository, getManager, EntityManager, getConnection } from 'typeorm';
import {
  AccountRoleListVo,
  RoleAccountListVo,
} from '../../controllers/account-role/vo/account.role.vo';
import { DistributionRoleDto } from '../../controllers/account-role/dto/distribution.role.dto';

@Injectable()
export class AccountRoleService {
  private readonly logger: Logger = new Logger(AccountRoleService.name);

  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
  ) {}

  /**
   * @Description: Obtain a list of authorized roles based on account id
   * @param {number} accountId
   * @return {*}
   */
  async accountRoleListByAccountId(accountId: number): Promise<AccountRoleListVo[] | undefined> {
    return await this.accountRoleRepository.find({
      where: { accountId },
      select: ['id', 'roleId'],
    });
  }

  /**
   * @Description: Assign roles to accounts
   * @param {DistributionRoleDto} distributionRoleDto
   * @return {*}
   */
  async distributionRole(distributionRoleDto: DistributionRoleDto): Promise<string> {
    const { accountId, roleList } = distributionRoleDto;
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        await entityManager.delete<AccountRoleEntity>(AccountRoleEntity, {
          accountId,
        });
        for (const item of roleList) {
          const result: AccountRoleEntity = entityManager.create<AccountRoleEntity>(
            AccountRoleEntity,
            {
              accountId,
              roleId: item,
            },
          );
          await entityManager.save(result);
        }
      })
      .then(() => {
        return 'Role assigned successfully';
      })
      .catch((e: HttpException) => {
        this.logger.error('Wrong role assigned to account', e.message);
        throw new HttpException(`Failed to assign role to account:${e.message}`, HttpStatus.OK);
      });
  }

  /**
   * @Description: Get all characters
   * @return {*}
   */
  async roleList(): Promise<RoleAccountListVo[]> {
    return await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .select(['role.id', 'role.name'])
      .getMany();
  }
}
