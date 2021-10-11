import { Entity, Column, Unique, Index, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import { Exclude } from 'class-transformer';
import NodeAuth from 'simp-node-auth';
import { isMobilePhone, isEmail } from 'class-validator';

import { SharedEntity } from '../../../../shared/entities/shared.entity';
import { usernameReg } from '@src/constants';
import { PlatformEnum, StatusEnum } from '../../../../../enums';

@Entity('account')
@Unique('username_mobile_email_unique', ['username', 'mobile', 'email'])
@Unique('username_deleted', ['username', 'deletedAt'])
@Unique('email_deleted', ['email', 'deletedAt'])
@Unique('mobile_deleted', ['mobile', 'deletedAt'])
export class AccountEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'username',
    comment: 'username',
  })
  username: string;
  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    select: false,
    comment: 'password',
  })
  password: string;
  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: 'mobile phone number',
  })
  mobile: string;
  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'email',
    comment: 'Mail',
  })
  email: string;
  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: 'Status, 0 means disabled, 1 means active',
  })
  status: StatusEnum;
  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'platform',
    default: 0,
    comment:
      'Platform: 0 means normal user (no authority), 1 means operation management, 2 means check-in business',
  })
  platform: PlatformEnum;
  @Column({
    type: 'tinyint',
    nullable: false,
    default: 0,
    name: 'is_super',
    comment: 'Whether it is a super administrator 1 means yes, 0 means no',
  })
  isSuper: number;
  @Exclude()
  private nodeAuth: NodeAuth;

  constructor() {
    super();
    this.nodeAuth = new NodeAuth();
  }

  @BeforeInsert()
  @BeforeUpdate()
  makePassword() {
    if (this.password) {
      this.password = this.nodeAuth.makePassword(this.password);
    }
  }

  @BeforeInsert()
  generateUserNameOrEmailOrMobile() {
    if (this.username) {
      this.mobile =
        this.mobile && isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : `_${this.username}`;
      this.email = this.email && isEmail(this.email) ? this.email : `_${this.username}`;
    } else if (this.mobile) {
      this.username =
        this.username && usernameReg.test(this.username) ? this.username : `_${this.mobile}`;
      this.email = this.email && isEmail(this.email) ? this.email : `_${this.mobile}`;
    } else if (this.email) {
      this.username =
        this.username && usernameReg.test(this.username) ? this.username : `_${this.email}`;
      this.mobile =
        this.mobile && isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : `_${this.email}`;
    }
  }

  @AfterLoad()
  formatResponseData() {
    this.mobile = isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : '';
    this.email = isEmail(this.email) ? this.email : '';
    this.username = usernameReg.test(this.username) ? this.username : '';
  }
}
