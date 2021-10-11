import { ApiProperty } from '@nestjs/swagger';

export class QueryVo {
  @ApiProperty({ description: 'Primary key id' })
  id?: number;

  @ApiProperty({ description: 'Created At Date' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated At Date' })
  updatedAt?: Date;
}
