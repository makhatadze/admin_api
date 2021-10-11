import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../../../admin/system/account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessEntity } from '../../../admin/system/access/entities/access.entity';
import adminConfig from '../../../../config/admin.config';

@Injectable()
export class InitDbService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}

  onModuleInit() {
    console.log('Initialize the database');
    this.initAccount();
    this.initAccess();
  }

  /**
   * @Description: Initialize account
   * @return {*}
   */
  private async initAccount(): Promise<void> {
    const username: string = adminConfig.defaultAccount;
    const password: string = adminConfig.defaultPassword;
    const isExist = await this.accountRepository.findOne({
      where: { username },
    });
    if (!isExist) {
      const account = this.accountRepository.create({
        username,
        password,
        isSuper: 1,
      });
      await this.accountRepository.save(account);
    }
  }

  /**
   * @Description: Initialize resources
   * @return {*}
   */
  private async initAccess(): Promise<void> {
    const accessList: Record<string, number | string>[] = [
      {
        moduleName: 'System Management',
        parentId: 0,
        url: 'system',
        type: 1,
        sort: 6,
      },
      {
        actionName: 'Account management',
        url: 'system/account',
        parentId: '1',
        type: 2,
        sort: 3,
      },
      {
        actionName: 'Role management',
        url: 'system/role',
        parentId: '1',
        type: 2,
        sort: 4,
      },
      {
        actionName: 'Resource management',
        url: 'system/access',
        parentId: '1',
        type: 2,
        sort: 5,
      },
      {
        url: '/api/v1/admin/account',
        parentId: '2',
        type: 3,
        sort: 1,
        apiName: 'Account list',
        method: 'GET',
      },
      {
        url: '/api/v1/admin/account',
        parentId: '2',
        type: 3,
        sort: 2,
        apiName: 'Create an account',
        method: 'POST',
      },
      {
        url: '/api/v1/admin/account/*',
        parentId: '2',
        type: 3,
        sort: 3,
        apiName: 'Delete account based on ID',
        method: 'DELETE',
      },
      {
        url: '/api/v1/admin/account/*',
        parentId: '2',
        type: 3,
        sort: 4,
        apiName: 'Modify account according to ID',
        method: 'PATCH',
      },
    ];
    // Insert data if it does not exist
    const isExist = await this.accessRepository.count();
    if (!isExist) {
      // Insert data in bulk
      await this.accessRepository.insert(accessList);
    }
  }
}
