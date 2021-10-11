import { QueryOptionsDto } from '@src/dto/query.options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateIf, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleReqDto extends QueryOptionsDto {
  @ApiPropertyOptional({ required: false, description: 'Role Name' })
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ required: false, description: 'state', enum: [0, 1] })
  @IsEnum(
    { Disable: 0, CurrentlyAvailable: 1 },
    { message: 'The status must be a number (0: means prohibited, 1: normal)' },
  )
  @Type(() => Number)
  @ValidateIf((o) => o.status != '')
  @IsOptional()
  readonly status?: number;
}
