import { QueryOptionsDto } from "../../../../../../../dto/query.options.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AccessReqDto extends QueryOptionsDto {
  @ApiPropertyOptional({ required: false, description: "Parent node ID" })
  @IsOptional()
  parentId?: number;
}
