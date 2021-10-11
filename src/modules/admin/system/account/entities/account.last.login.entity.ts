import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IpToAddressService } from '../../../../common/tencent-map/ip-to-address/ip-to-address.service';

@Entity('account_last_login')
export class AccountLastLoginEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'Primary key id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'account_id',
    comment: 'Account id',
  })
  accountId: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 60,
    name: 'last_login_ip',
    comment: 'Last login id',
  })
  lastLoginIp: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'last_login_address',
    comment: 'Last login address',
  })
  lastLoginAddress: string | null;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login_time',
    comment: 'Last login time',
  })
  lastLoginTime: Date;

  @BeforeInsert()
  async generateLastLoginAddress() {
    // Call a third party to find the address based on the ip address
    const ipToAddressService = new IpToAddressService();
    if (this.lastLoginIp) {
      this.lastLoginAddress = await ipToAddressService.IpToAddress(this.lastLoginIp);
    }
  }
}
