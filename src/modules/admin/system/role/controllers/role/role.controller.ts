import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  Param,
  Patch,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { RoleService } from '../../services/role/role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { UpdateRoleDto } from './dto/update.role.dto';
import { RoleListVo, RoleVo } from './vo/role.vo';
import { RoleReqDto } from './dto/role.req.dto';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('Backstage management system-role management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: 'Creating a Role',
    description: 'Creating a Role',
  })
  @ApiOkResponse({
    type: String,
    description: 'Create role return value',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<string> {
    return await this.roleService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Delete role', description: 'Delete roles based on role id' })
  @ApiOkResponse({
    type: String,
    description: 'Delete role return value',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async destroyRoleById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.roleService.destroyRoleById(id);
  }

  @ApiOperation({ summary: 'Modify role', description: 'Modify the role according to the role id' })
  @ApiOkResponse({
    type: String,
    description: 'Modify role return value',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async modifyRoleById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<string> {
    return await this.roleService.modifyRoleById(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Query role', description: 'Query role based on role id' })
  @ApiOkResponse({
    type: RoleVo,
    description: 'Query the return value of a single role',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async roleById(@Param('id', new ParseIntPipe()) id: number): Promise<RoleVo | undefined> {
    return await this.roleService.roleById(id);
  }

  @ApiOperation({
    summary: 'Query role list',
    description: 'Query role',
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&name=x&status=0',
    },
  })
  @ApiOkResponse({
    type: RoleListVo,
    description: 'Paging query role return value',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async roleList(@Query() roleReqDto: RoleReqDto): Promise<RoleListVo> {
    return await this.roleService.roleList(roleReqDto);
  }
}
