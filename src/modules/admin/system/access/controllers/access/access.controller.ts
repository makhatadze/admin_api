import {
  Controller,
  UseGuards,
  Post,
  HttpStatus,
  Body,
  HttpCode,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { AccessService } from '../../services/access/access.service';
import { CreateAccessDto } from './dto/create.access.dto';
import { UpdateAccessDto } from './dto/update.access.dto';
import { AccessListVo, AccessVo } from './vo/access.vo';
import { AccessReqDto } from './dto/access.req.dto';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('Backstage management system-resource management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {
  }

  @ApiOperation({
    summary: 'Create resources',
    description: 'Create resources',
  })
  @ApiOkResponse({
    type: String,
    description: 'Create resource return value',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Body() createAccessDto: CreateAccessDto,
  ): Promise<string> {
    return await this.accessService.createAccess(createAccessDto);
  }

  @ApiOperation({
    summary: 'Delete resource',
    description: 'Delete resources based on resource ID',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async destroyAccessById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<string> {
    return await this.accessService.destroyAccessById(id);
  }

  @ApiOperation({
    summary: 'Modify resources',
    description: 'Modify the resource based on the resource ID',
  })
  @ApiOkResponse({
    type: String,
    description: 'Modify the return value of the resource',
  })
  @Patch(':id')
  async modifyAccessById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccessDto: UpdateAccessDto,
  ): Promise<string> {
    return await this.accessService.modifyAccessById(id, updateAccessDto);
  }

  @ApiOperation({
    summary: 'Get the menu',
    description: 'Get all the menus (no paging, assign resources to roles)',
  })
  @ApiOkResponse({
    type: AccessVo,
    isArray: true,
    description: 'Get all menus and return to DTO',
  })
  @HttpCode(HttpStatus.OK)
  @Get('access_list')
  async accessList(): Promise<AccessVo[]> {
    return await this.accessService.accessList();
  }

  @ApiOperation({
    summary: 'Get a list of resources',
    description: 'Paging to get the resource list (top level)',
    externalDocs: {
      url: 'xxx?pageSize=10&pageNumber=1',
    },
  })
  @ApiOkResponse({
    type: AccessListVo,
    description: 'Get a list of resources by page',
  })
  @Get()
  async accessListPage(
    @Query() accessReqDto: AccessReqDto
  ): Promise<AccessListVo> {
    return await this.accessService.accessListPage(accessReqDto);
  }
}
