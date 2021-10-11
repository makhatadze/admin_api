import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create.account.dto';
import { AccountService } from '../../services/account/account.service';
import { UpdateAccountDto } from './dto/update.account.dto';
import { ModifyPasswordDto } from './dto/modify.password.dto';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { AccountVo, AccountListVo } from './vo/account.vo';
import { AccountReqDto } from './dto/account.req.dto';
import { CurrentUser, ICurrentUserType } from '@src/decorators/current.user';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('Backstage management system-account management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: 'Create an account',
    description: 'Create an account',
  })
  @ApiOkResponse({
    type: String,
    description: 'Create account return value',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({
    summary: 'Reset to default password',
    description: 'Reset default password based on id',
  })
  @ApiOkResponse({ type: String, description: 'Reset password return value' })
  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  async resetPassword(@Body() data: { id: number }): Promise<string> {
    const { id } = data;
    return await this.accountService.resetPassword(id);
  }

  @ApiOperation({
    summary: 'Change Password',
    description: "According to the account's own password",
  })
  @ApiOkResponse({
    type: String,
    description: 'Modify account password return value',
  })
  @HttpCode(HttpStatus.OK)
  @Post('modify_password')
  async modifyPassWordById(
    @CurrentUser() userInfo: ICurrentUserType,
    @Body() modifyPasswordDto: ModifyPasswordDto,
  ): Promise<string> {
    const { id } = userInfo;
    return await this.accountService.modifyPassWordById(id, modifyPasswordDto);
  }

  @ApiOperation({ summary: 'Delete account', description: 'Delete account based on id' })
  @ApiOkResponse({
    type: String,
    description: 'Modify account return value',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async destroyById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accountService.destroyById(id);
  }

  @ApiOperation({
    summary: 'Modify account information',
    description: 'Modify account information according to account id',
  })
  @ApiOkResponse({
    type: String,
    description: 'Modify account return value',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async modifyById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<string> {
    return await this.accountService.modifyById(id, updateAccountDto);
  }

  @ApiOperation({
    summary: 'Query account information',
    description: 'Query account information based on account id',
  })
  @ApiOkResponse({
    type: AccountVo,
    description: 'Query the return value of a single account',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async accountById(@Param('id', new ParseIntPipe()) id: number): Promise<AccountVo | undefined> {
    return await this.accountService.accountById(id);
  }

  @ApiOperation({
    summary: 'Query account list',
    description: 'Query account list based on conditions',
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&username=xx&email=xx&mobile=xx&status=0&platform=1',
    },
  })
  @ApiOkResponse({
    type: AccountListVo,
    description: 'Page query account return value',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async accountList(@Query() accountReqDto: AccountReqDto): Promise<AccountListVo> {
    return await this.accountService.accountList(accountReqDto);
  }
}
