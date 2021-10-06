import { AccessDto } from "./access.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateAccessDto extends AccessDto {
  @ApiProperty({
    required: true,
    description: "节点类型, 表示模块顶级模块: 1, 表示菜单: 2, 操作(API): 3",
    enum: [1, 2, 3]
  })
  @IsEnum(
    { MODULE: 1, MENU: 2, OPERATE: 3 },
    { message: "The resource type must be one of 1, 2, 3" }
  )
  @IsInt({ message: "Node type must be an integer" })
  @Type(() => Number)
  @IsNotEmpty({ message: "Node type cannot be empty" })
  readonly type: string;
}
