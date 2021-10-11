import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMobilePhone,
  ValidateIf,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AccountDto {
  @ApiPropertyOptional({ required: false, description: 'mobile phone number' })
  @IsMobilePhone('zh-CN', {}, { message: 'Wrong format of phone number' })
  @ValidateIf((o) => o.mobile != '')
  @IsOptional()
  readonly mobile?: string;

  @ApiPropertyOptional({ required: false, description: 'Email' })
  @IsEmail({}, { message: 'Email format error' })
  @ValidateIf((o) => o.email != '')
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ required: false, description: 'state', enum: [0, 1] })
  @IsEnum(
    { DISABLE: 0, ACTIVE: 1 },
    { message: 'The status must be a number (0: means prohibited, 1: normal)' },
  )
  @Type(() => Number)
  @ValidateIf((o) => o.status != '')
  @IsOptional()
  readonly status?: number;

  @ApiPropertyOptional({
    required: false,
    description: 'platform',
    enum: [0, 1, 2],
  })
  @IsEnum(
    { GENERAL_USER: 0, OPERATION_MANAGER: 1, MERCHANT: 2 },
    {
      message:
        'The platform must be a number (0 means normal user (no permission), 1 means operation management, 2 means check-in business)',
    },
  )
  @Type(() => Number)
  @ValidateIf((o) => o.platform != '')
  @IsOptional()
  readonly platform?: number;
}
