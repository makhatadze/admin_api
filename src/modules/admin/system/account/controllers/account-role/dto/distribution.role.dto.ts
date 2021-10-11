import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class DistributionRoleDto {
  @ApiProperty({ required: true, description: 'Account ID' })
  @IsInt({ message: 'Account ID must be an integer' })
  @IsNotEmpty({ message: 'Account ID cannot be empty' })
  readonly accountId: number;

  @ApiProperty({ required: true, description: 'Role ID list' })
  // @ValidateNested({
  //   each: true, // Check each item in the array
  // })
  @Type(() => Number)
  @ArrayMinSize(1, { message: 'At least one role' })
  @IsArray({ message: 'The list of role IDs must be an array' })
  readonly roleList: number[];
}
