import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, SelectQueryBuilder } from 'typeorm';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { isMobilePhone, isEmail } from 'class-validator';
import { AccountLastLoginEntity } from '../../entities/account.last.login.entity';
import { AccountTokenEntity } from '../../entities/account.token.entity';
import { ConfigService, InjectConfig } from 'nestjs-config';
import moment from 'moment';
import { usernameReg } from '@src/constants';
import { ICurrentUserType } from '@src/decorators/current.user';

@Injectable()
export class LoginService {
  private logger: Logger = new Logger(LoginService.name);

  constructor(
    @InjectRepository(AccountLastLoginEntity)
    private readonly accountLastLoginRepository: Repository<AccountLastLoginEntity>,
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
    private readonly toolsService: ToolsService,
    @InjectConfig()
    private readonly configService: ConfigService,
  ) {}

  /**
   * @Description: Public query part
   * @return {*}
   */
  private get queryLoginBuilder(): SelectQueryBuilder<AccountEntity> {
    return getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.platform', 'platform')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.password', 'password');
  }

  /**
   * @Description: Backstage management user login
   * @param {LoginDto} loginDto
   * @param {string} ipAddress
   * @return {*}
   */
  async adminLogin(
    loginDto: LoginDto,
    ipAddress: string,
  ): Promise<{
    isSuper: number;
    mobile: string;
    id: number;
    email: string;
    platform: number;
    token: string;
    username: string;
  }> {
    try {
      const { username, password } = loginDto;
      type TypeAccountFindResult = Extract<AccountEntity, ICurrentUserType> | undefined;
      let findAccount: TypeAccountFindResult;
      const queryBuilder = this.queryLoginBuilder;
      // According to mobile phone number
      if (isMobilePhone(username, 'zh-CN')) {
        findAccount = await queryBuilder
          .where('(account.mobile = :mobile)', { mobile: username })
          .getRawOne();
      } else if (isEmail(username)) {
        // Query by email
        findAccount = await queryBuilder
          .where('(account.email = :email)', { email: username })
          .getRawOne();
      } else {
        // Username query
        findAccount = await queryBuilder
          .where('(account.username = :username)', { username })
          .getRawOne();
      }
      if (
        findAccount &&
        findAccount.password &&
        this.toolsService.checkPassword(password, findAccount.password)
      ) {
        // Record the last login time and ip address
        const lastLogin = this.accountLastLoginRepository.create({
          accountId: findAccount.id,
          lastLoginIp: ipAddress,
        });
        await this.accountLastLoginRepository.save(lastLogin);
        this.logger.log('Current user', findAccount);
        // Generate the token, store it in the token table and return it to the front end
        const token = this.toolsService.uuidToken;
        const { id, username, email, mobile, isSuper, platform } =
          this.filterAccountField(findAccount);
        const tokenExpire: number = this.configService.get('admin.tokenExpire');
        const accountToken = {
          userId: id,
          username,
          email,
          mobile,
          isSuper,
          platform,
          token,
          // Set token expiration time
          expireTime: moment().add(tokenExpire, 'day').format('YYYY-MM-DD HH:mm:ss'),
        };
        // First judge whether there is a record before, update if there is a record, and create if there is no record
        const accountTokenResult: Pick<AccountTokenEntity, 'id'> | undefined =
          await this.accountTokenRepository.findOne({
            where: { userId: id },
            select: ['id'],
          });
        if (accountTokenResult?.id) {
          await this.accountTokenRepository.update({ id: accountTokenResult.id }, accountToken);
        } else {
          const accountTokenSave: AccountTokenEntity =
            this.accountTokenRepository.create(accountToken);
          await this.accountTokenRepository.save(accountTokenSave);
        }
        return {
          token,
          id,
          username,
          email,
          mobile,
          isSuper,
          platform,
        };
      } else {
        throw new HttpException('Wrong user name or password', HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('Wrong user name or password', e);
      throw new HttpException('Wrong user name or password', HttpStatus.OK);
    }
  }

  /**
   * @Description: Come field
   * @param {ICurrentUserType} accountInfo
   * @return {*}
   */
  private filterAccountField(accountInfo: ICurrentUserType): ICurrentUserType {
    const { username, mobile, email } = accountInfo;
    const _mobile = isMobilePhone(mobile, 'zh-CN') ? mobile : '';
    const _email = isEmail(email) ? email : '';
    const _username = usernameReg.test(username) ? username : '';
    return {
      ...accountInfo,
      username: _username,
      mobile: _mobile,
      email: _email,
    };
  }
}
