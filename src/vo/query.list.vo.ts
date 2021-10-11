import { ApiProperty } from '@nestjs/swagger';

export class QueryListVo {
  @ApiProperty({ description: 'Total pages' })
  total: number;

  @ApiProperty({ description: 'Page number' })
  pageSize: number;

  @ApiProperty({ description: 'Current page' })
  pageNumber: number;
}
