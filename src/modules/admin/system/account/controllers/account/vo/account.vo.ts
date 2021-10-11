import { ApiProperty } from '@nestjs/swagger';
import { QueryListVo } from '@src/vo/query.list.vo';
import { QueryVo } from '@src/vo/query.vo';

export class AccountVo extends QueryVo {
  @ApiProperty({ description: 'Username' })
  username?: string;

  @ApiProperty({ description: 'Mail' })
  email?: string;

  @ApiProperty({ description: 'mobile phone number' })
  mobile?: string;

  @ApiProperty({ description: 'Status, 0 means not active, 1 means active' })
  status?: number;

  @ApiProperty({
    description: 'Platform: 0 means normal user (no authority), 1 means operation management, 2 means check-in business',
  })
  platform?: number;
}

export class AccountListVo extends QueryListVo {
  @ApiProperty({ description: 'Return data list', type: AccountVo, isArray: true })
  data: AccountVo[];
}
