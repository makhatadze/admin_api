import { ApiProperty } from '@nestjs/swagger';

export class QueryVo {
  @ApiProperty({ description: 'Primary key id' })
  id?: number;

  @ApiProperty({ description: 'Creation time' })
  createdAt?: Date;

  @ApiProperty({ description: 'Update time' })
  updatedAt?: Date;
}
