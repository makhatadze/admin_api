import { QueryVo } from "../../../../../../vo/query.vo";
import { QueryListVo } from "../../../../../../vo/query.list.vo";
import { ApiProperty } from "@nestjs/swagger";

export class AccessVo extends QueryVo {
  @ApiProperty({ description: "Module nam" })
  moduleName: string;

  @ApiProperty({ description: "Operation name" })
  actionName: string;

  @ApiProperty({ description: "Small icon" })
  icon?: string;

  @ApiProperty({ description: "Url address" })
  url: string;

  @ApiProperty({ description: "Request method for operation" })
  method?: string;

  @ApiProperty({ description: "Parent module ID" })
  parentId: number;

  @ApiProperty({ description: "Sort" })
  sort: number;

  @ApiProperty({ description: "Profile" })
  description?: string;
}

export class AccessListVo extends QueryListVo {
  @ApiProperty({
    description: "Return data list",
    type: AccessVo,
    isArray: true
  })
  data: AccessVo[];
}
