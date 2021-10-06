import { AccessDto } from "./access.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class UpdateAccessDto extends AccessDto {
  @ApiPropertyOptional({
    required: false,
    description:
      "Node type, Indicates the top-level module of the module: 1, Represents the menu: 2, Represents the menu(API): 3",
    enum: [1, 2, 3]
  })
  @IsEnum({ MODULE: 1, MENU: 2, OPERATE: 3 }, { message: "The resource type must be one of 1, 2, 3" })
  @IsInt({ message: "Node type must be an integer" })
  @Type(() => Number)
  @ValidateIf((o) => o.moduleName != "")
  @IsOptional()
  readonly type: string;
}
