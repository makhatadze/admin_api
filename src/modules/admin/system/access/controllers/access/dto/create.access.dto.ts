import { AccessDto } from './access.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccessDto extends AccessDto {
  @ApiProperty({
    required: true,
    description:
      'Node type, indicating the top-level module of the module: 1, indicating the menu: 2, operation (API): 3',
    enum: [1, 2, 3],
  })
  @IsEnum(
    { MODULE: 1, MENU: 2, OPERATE: 3 },
    { message: 'The resource type must be one of 1, 2, 3' },
  )
  @IsInt({ message: 'Node type must be an integer' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Node type cannot be empty' })
  readonly type: string;
}
