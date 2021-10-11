import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { RoleDto } from './role.dto';

export class CreateRoleDto extends RoleDto {
  @ApiProperty({ required: true, description: 'Role Name' })
  @IsString({ message: 'The role name must be a character type' })
  @IsNotEmpty({ message: 'Role name cannot be empty' })
  readonly name: string;
}
