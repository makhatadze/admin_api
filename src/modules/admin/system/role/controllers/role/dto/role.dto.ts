import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMobilePhone,
  ValidateIf,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoleDto {
  @ApiPropertyOptional({ required: false, description: 'Mobile phone number' })
  @IsMobilePhone('zh-CN', {}, { message: 'Wrong format of phone number' })
  @ValidateIf((o) => o.mobile != '')
  @IsOptional()
  readonly mobile?: string;

  @ApiPropertyOptional({ required: false, description: 'Profile' })
  @MaxLength(100, { message: 'The longest character is 100' })
  @IsString({ message: 'The tracing element must be a character type' })
  @ValidateIf((o) => o.description != '')
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ required: false, description: 'State', enum: [0, 1] })
  @IsEnum(
    { Disable: 0, CurrentlyAvailable: 1 },
    { message: 'The status must be a number (0: means prohibited, 1: normal)' },
  )
  @Type(() => Number)
  @ValidateIf((o) => o.status != '')
  @IsOptional()
  readonly status?: number;

  @ApiPropertyOptional({ required: false, description: 'Is it the default role', enum: [0, 1] })
  @IsEnum(
    { 不开通: 0, 开通: 1 },
    { message: 'The platform must be a number (1 means open, 0 means not open)' },
  )
  @Type(() => Number)
  @ValidateIf((o) => o.isDefault != '')
  @IsOptional()
  readonly isDefault?: number;
}
