import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { generateCharacters } from 'src/@utils';
import { AppException } from 'src/common';
import { User, UserCategory, UserOauth, UserOauthProviderEnum, UserRoleEnum } from 'src/entities';
import { CommandManager } from 'src/entities/@commands';
import { UserQueryManager } from 'src/entities/@queries';
import { JwtService, TrxService } from 'src/globals';
import { Repository } from 'typeorm';
import { RefreshAccessTokenDto, SignInDto, SignUpDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  private readonly userCommand: CommandManager<User>;
  private readonly userCategoryCommand: CommandManager<UserCategory>;
  private readonly userOauthCommand: CommandManager<UserOauth>;
  private readonly userQuery: UserQueryManager;

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCategory)
    private readonly userCategoryRepository: Repository<UserCategory>,
    @InjectRepository(UserOauth)
    private readonly userOauthRepository: Repository<UserOauth>,
    private readonly jwtService: JwtService,
    private readonly trxService: TrxService,
  ) {
    this.userCommand = CommandManager(this.userRepository);
    this.userCategoryCommand = CommandManager(this.userCategoryRepository);
    this.userOauthCommand = CommandManager(this.userOauthRepository);
    this.userQuery = UserQueryManager(this.userRepository);
  }

  async signUpUser(data: SignUpDto) {
    const { age, gender, name, phone, role, password, userCategories } = data;

    const secretKey = generateCharacters(9);
    const user = await this.userCommand.createOne({
      age,
      gender,
      name,
      phone,
      role,
      password: await bcrypt.hash(password, 12),
      secretKey,
    });

    if (userCategories) {
      this.userCategoryCommand.createMany(
        userCategories.map((userCategory) => ({ ...userCategory, userId: user.id })),
      );
    }

    const authTokens = await this.jwtService.issueAuthTokens({ id: user.id, secretKey });
    return authTokens;
  }

  async signInUser(data: SignInDto) {
    const { phone, password } = data;

    const user = await this.userQuery.build().phone(phone).getOneOrFail();
    const isValid = await user.comparePassword(password);
    if (!isValid) throw new AppException('invalid phone or password', HttpStatus.BAD_REQUEST);

    const secretKey = generateCharacters(9);
    await this.userCommand.updateOne(user.id, { secretKey, updatedAt: user.updatedAt });

    const authTokens = await this.jwtService.issueAuthTokens({ id: user.id, secretKey });
    return authTokens;
  }

  async refreshAccessToken(data: RefreshAccessTokenDto) {
    const { accessToken, refreshToken } = data;

    const accessTokenPayload = await this.jwtService.decodeExpiredAccessToken(accessToken);
    const refreshTokenPayload = await this.jwtService.decodeRefreshToken(refreshToken);
    if (
      accessTokenPayload.id !== refreshTokenPayload.id ||
      accessTokenPayload.secretKey !== refreshTokenPayload.secretKey
    ) {
      throw new UnauthorizedException();
    }

    const user = await this.userQuery.build().id(accessTokenPayload.id).getOneOrFail();
    if (!user || user.secretKey !== accessTokenPayload.secretKey) {
      throw new AppException('invalid user secretKey. please login again', HttpStatus.UNAUTHORIZED);
    }

    const authTokens = await this.jwtService.issueAuthTokens({
      id: user.id,
      secretKey: user.secretKey,
    });

    return authTokens.accessToken;
  }

  async createKakaoUser(data: {
    name: string;
    phone: string;
    oauthId: string;
    accessToken: string;
    refreshToken: string;
  }) {
    const queryRunner = await this.trxService.getQueryRunner();
    const userTrxCommand = CommandManager(queryRunner.manager.getRepository(User));
    const userOauthTrxCommand = CommandManager(queryRunner.manager.getRepository(UserOauth));

    const fn = async () => {
      const { phone, name, oauthId, accessToken, refreshToken } = data;

      const secretKey = generateCharacters(9);
      const user = await userTrxCommand.createOne({
        phone,
        name,
        secretKey,
        role: UserRoleEnum.User,
      });
      await userOauthTrxCommand.createOne({
        oauthId,
        accessToken,
        refreshToken,
        oauthProvider: UserOauthProviderEnum.Kakao,
        userId: user.id,
      });

      return user;
    };

    const newKakaoAuthUser = await this.trxService.runTransaction(queryRunner, fn);
    const authTokens = await this.jwtService.issueAuthTokens({
      id: newKakaoAuthUser.id,
      secretKey: newKakaoAuthUser.secretKey,
    });

    return authTokens;
  }

  async loginKakaoUser(oauthId: string, refreshToken: string) {
    const user = await this.userQuery
      .build()
      .leftJoinAndSelect('user.userOauth', 'userOauth')
      .andWhere('userOauth.oauthId = :oauthId', { oauthId })
      .andWhere('userOauth.oauthProvider = :provider', { provider: UserOauthProviderEnum.Kakao })
      .getOne();

    if (!user) return false;

    if (user.userOauth.refreshToken !== refreshToken) {
      await this.userOauthCommand.updateOne(user.userOauth.id, { refreshToken });
    }

    const secretKey = generateCharacters(9);
    await this.userCommand.updateOne(user.id, { secretKey, updatedAt: user.updatedAt });
    const authTokens = await this.jwtService.issueAuthTokens({ id: user.id, secretKey });
    return authTokens;
  }
}
