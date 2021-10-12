import { ApiProperty } from '@nestjs/swagger';

export class QueryListVo {
  @ApiProperty({ description: 'total pages' })
  total: number;

  @ApiProperty({ description: 'page number' })
  pageSize: number;

  @ApiProperty({ description: 'current page' })
  pageNumber: number;
}
