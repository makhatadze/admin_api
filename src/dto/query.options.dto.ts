import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryOptionsDto {
  @ApiPropertyOptional({
    required: false,
    description: 'How many items are displayed on one page',
  })
  @IsOptional()
  readonly pageSize?: number;

  @ApiPropertyOptional({ required: false, description: 'current page' })
  @IsOptional()
  readonly pageNumber?: number;
}
