import { QueryVo } from '@src/vo/query.vo';
import { ApiProperty } from '@nestjs/swagger';

export class MenusListVo extends QueryVo {
  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'Small icon' })
  icon?: string;

  @ApiProperty({ description: 'url address' })
  url: string;

  @ApiProperty({ description: 'Request method for operation' })
  method?: string;

  @ApiProperty({ description: 'Parent module ID' })
  parentId: number;

  @ApiProperty({ description: 'Sort' })
  sort: number;

  @ApiProperty({ description: 'Profile' })
  description?: string;
}
