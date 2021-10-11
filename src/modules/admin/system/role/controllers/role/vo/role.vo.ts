import { ApiProperty } from '@nestjs/swagger';
import { QueryListVo } from '@src/vo/query.list.vo';
import { QueryVo } from '@src/vo/query.vo';

export class RoleVo extends QueryVo {
  @ApiProperty({ description: 'Role Name' })
  name?: string;

  @ApiProperty({ description: 'Role profile' })
  description?: string;

  @ApiProperty({ description: '1 means the default role, 0 means non-default role' })
  isDefault?: number;
}

export class RoleListVo extends QueryListVo {
  @ApiProperty({ description: 'Return data list', type: RoleVo, isArray: true })
  data: RoleVo[];
}
