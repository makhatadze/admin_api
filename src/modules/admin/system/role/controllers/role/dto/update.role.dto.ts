import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ValidateIf, IsOptional } from 'class-validator';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends RoleDto {
  @ApiPropertyOptional({ required: false, description: 'Role Name' })
  @IsString({ message: 'The role name must be a character type' })
  @ValidateIf((o) => o.name != '')
  @IsOptional()
  readonly name: string;
}
