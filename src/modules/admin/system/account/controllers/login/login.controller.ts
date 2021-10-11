import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { LoginService } from '../../services/login/login.service';
import { LoginDto } from './dto/login.dto';
import { IpAddress } from '@src/decorators/ip.address';
import { LoginVo } from './vo/login.vo';
import { LoggerService } from '@src/modules/shared/services/logger/logger.service';

@ApiTags('Backstage management system-user login')
@Controller('login')
export class LoginController {
  private readonly logger: Logger = new Logger(LoginController.name);
  private readonly loggerService = new LoggerService(LoginController.name);

  constructor(private readonly loginService: LoginService) {
  }

  @ApiOperation({
    summary: 'User login',
    description: 'Username can be mobile phone number, email, username',
  })
  @ApiOkResponse({
    type: LoginVo,
    description: 'User login return value',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async adminLogin(@Body() loginDto: LoginDto, @IpAddress() ipAddress: string): Promise<LoginVo> {
    this.logger.log('Login parameters received:', loginDto);
    this.loggerService.info(loginDto, 'Login parameters');
    return this.loginService.adminLogin(loginDto, ipAddress);
  }
}
