import { PlatformEnum } from '@src/enums';
import { SharedEntity } from '../../../../shared/entities/shared.entity';
import { Column, Entity } from 'typeorm';

@Entity('account_token')
export class AccountTokenEntity extends SharedEntity {
  @Column({
    type: 'int',
    nullable: false,
    unique: true,
    name: 'user_id',
    comment: 'ID of the associated user table',
  })
  userId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
    name: 'token',
    comment: 'token',
  })
  token: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 45,
    name: 'username',
    comment: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: 'mobile phone number',
  })
  mobile: string;

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
    name: 'platform',
    default: 0,
    comment: 'Platform: 0 means normal user (no authority), 1 means operation management, 2 means check-in business',
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

  @Column({
    type: 'timestamp',
    name: 'expire_time',
    nullable: false,
    comment: 'Expiration time',
  })
  expireTime: Date;
}
