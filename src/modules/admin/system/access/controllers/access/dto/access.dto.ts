import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  MaxLength,
  IsOptional,
  ValidateIf,
  IsString,
  IsInt
} from "class-validator";
import { Type } from "class-transformer";

export class AccessDto {
  @ApiPropertyOptional({ required: false, description: "模块名称" })
  @MaxLength(50, { message: "Maximum length is 50" })
  @IsString({ message: "The module name must be a string" })
  @ValidateIf((o) => o.moduleName != "")
  @IsOptional()
  readonly moduleName?: string;

  @ApiPropertyOptional({ required: false, description: "Operation name(API)" })
  @IsString({ message: "Operation name must be a string" })
  @IsOptional()
  readonly actionName?: string;

  @ApiPropertyOptional({ required: false, description: "Icon name" })
  @IsString({ message: "Icon must be a string" })
  @ValidateIf((o) => o.icon != "")
  @IsOptional()
  readonly icon?: string;

  @ApiPropertyOptional({ required: false, description: "url address" })
  @IsString({ message: "URL address must be a string" })
  @ValidateIf((o) => o.url != "")
  @IsOptional()
  readonly url?: string;

  @ApiPropertyOptional({ required: false, description: "Request method" })
  @IsString({ message: "The method request method must be a character type" })
  @ValidateIf((o) => o.method != "")
  @IsOptional()
  readonly method?: string;

  @ApiPropertyOptional({
    required: false,
    description: "Parent node module id"
  })
  @IsInt({ message: "Module parent node must be a number" })
  @Type(() => Number)
  @ValidateIf((o) => o.parentId != "")
  @IsOptional()
  readonly parentId?: number;

  @ApiPropertyOptional({ required: false, description: "Sort" })
  @IsInt({ message: "Sort must be numeric" })
  @Type(() => Number)
  @ValidateIf((o) => o.sort != "")
  @IsOptional()
  readonly sort?: number;

  @ApiPropertyOptional({ required: false, description: "Profile" })
  @MaxLength(100, { message: "The maximum drawing element length is 100" })
  @IsString({ message: "The tracing element must be a character type" })
  @ValidateIf((o) => o.description != "")
  @IsOptional()
  readonly description?: string;
}
