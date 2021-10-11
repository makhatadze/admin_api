import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AccountRoleService } from '../../services/account-role/account-role.service';
import { AccountRoleListVo, RoleAccountListVo } from './vo/account.role.vo';
import { DistributionRoleDto } from './dto/distribution.role.dto';
import { ApiAuth } from '@src/decorators/api.auth';
import { AuthGuard } from '@src/guard/auth/auth.guard';

@ApiTags('Backstage management system-account role management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('account_role')
export class AccountRoleController {
  constructor(private readonly accountRoleService: AccountRoleService) {
  }

  @ApiOperation({
    summary: 'Get a list of roles',
    description: 'Get the role authorized by the role according to the current account id',
  })
  @ApiOkResponse({
    type: AccountRoleListVo,
    isArray: true,
    description: 'Query the authorized role return value based on the account ID',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':accountId')
  async accountRoleListByAccountId(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<AccountRoleListVo[] | undefined> {
    return this.accountRoleService.accountRoleListByAccountId(accountId);
  }

  @ApiOperation({
    summary: 'Assign roles to accounts',
    description: 'Assign a role to the current account',
  })
  @ApiOkResponse({
    type: String,
    description: 'Return value for account authorization role',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async distributionRole(@Body() distributionRoleDto: DistributionRoleDto): Promise<string> {
    return await this.accountRoleService.distributionRole(distributionRoleDto);
  }

  @ApiOperation({
    summary: 'According to all the roles',
    description: 'Used when assigning roles to accounts',
  })
  @ApiOkResponse({
    type: RoleAccountListVo,
    isArray: true,
    description: 'Role return list',
  })
  @Get()
  async roleList(): Promise<RoleAccountListVo[]> {
    return await this.accountRoleService.roleList();
  }
}
