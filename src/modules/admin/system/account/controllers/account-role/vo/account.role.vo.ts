import { ApiProperty } from '@nestjs/swagger';

export class AccountRoleListVo {
  @ApiProperty({ required: true, description: 'Account ID' })
  accountId?: number;

  @ApiProperty({ required: true, description: 'Role ID' })
  roleId?: number;
}

export class RoleAccountListVo {
  @ApiProperty({ required: true, description: 'Role ID' })
  id: number;

  @ApiProperty({ required: true, description: 'Role Name' })
  name: string;
}
