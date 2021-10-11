import { ApiProperty } from '@nestjs/swagger';
import { QueryVo } from '@src/vo/query.vo';

export class LoginVo extends QueryVo {
  @ApiProperty({ description: 'Mobile phone number bound to the account' })
  mobile?: string;

  @ApiProperty({ description: 'Email address bound to the account' })
  email?: string;

  @ApiProperty({ description: 'Username' })
  username?: string;

  @ApiProperty({ description: 'Status: 0 means forbidden, 1 means normal' })
  status?: number;

  @ApiProperty({
    description:
      'Platform: 0: means ordinary personnel (no authority), 1 means operation management, 2 means check-in business',
  })
  platform?: number;

  @ApiProperty({ description: 'Whether you are a super administrator: 1 means yes, 0 means no' })
  isSuper?: number;

  @ApiProperty({ description: 'Login token' })
  token?: string;
}
