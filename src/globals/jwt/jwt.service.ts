import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError, VerifyOptions } from 'jsonwebtoken';
import { JwtManager } from './jwt.module';
import { AuthTokenPayload, SomeTokenPayload } from './token-payload.type';

@Injectable()
export class JwtService {
  private readonly helper: JwtServiceHelper;

  constructor(@Inject('JWT_MANAGER') private readonly jwtManager: JwtManager) {
    this.helper = new JwtServiceHelper(this.jwtManager);
  }

  async issueAuthTokens(payload: Pick<AuthTokenPayload, 'id' | 'secretKey'>) {
    const accessToken = await this.helper.issueAccessToken(payload);
    const refreshToken = await this.helper.issueRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async decodeAccessToken(accessToken: string) {
    const accessTokenPayload = await this.helper
      .decodeToken<AuthTokenPayload>(accessToken)
      .catch((error) => {
        if (error instanceof TokenExpiredError)
          error.message = 'accessToken is expired. please update accessToken';

        throw error;
      });

    if (!accessTokenPayload?.id || accessTokenPayload?.type !== 'access')
      throw new UnauthorizedException();

    return accessTokenPayload;
  }

  async decodeExpiredAccessToken(accessToken: string) {
    const accessTokenPayload = await this.helper.decodeToken<AuthTokenPayload>(accessToken, {
      ignoreExpiration: true,
    });

    if (!accessTokenPayload?.id || accessTokenPayload?.type !== 'access')
      throw new UnauthorizedException();

    return accessTokenPayload;
  }

  async decodeRefreshToken(refreshToken: string) {
    const refreshTokenPayload = await this.helper
      .decodeToken<AuthTokenPayload>(refreshToken)
      .catch((error) => {
        if (error instanceof TokenExpiredError)
          error.message = 'refreshToken is expired. please login again';

        throw error;
      });

    if (!refreshTokenPayload?.id || refreshTokenPayload?.type !== 'refresh')
      throw new UnauthorizedException();

    return refreshTokenPayload;
  }

  /** TEST 전용: input으로 받은 token이랑 같은 정보를 가진 만료된 token을 생성 */
  async generateExpiredAuthToken(token: string) {
    const { sign, config } = this.jwtManager;
    const { id, secretKey, type } = await this.helper.decodeToken<AuthTokenPayload>(token);
    const expiredToken = sign({ id, secretKey, type }, config.secret, {
      expiresIn: '1s',
    });

    return expiredToken;
  }
}

/**
 * Helper Class
 * - Class의 private 메소드를 모아두는 용도
 * - why? 분리하면 좋으니까..?
 */
class JwtServiceHelper {
  constructor(private readonly jwtManager: JwtManager) {}

  async issueAccessToken(payload: Pick<AuthTokenPayload, 'id' | 'secretKey'>) {
    const { sign, config } = this.jwtManager;
    const token = sign({ type: 'access', ...payload }, config.secret, {
      expiresIn: config.accessExpiresIn,
    });
    return token;
  }

  async issueRefreshToken(payload: Pick<AuthTokenPayload, 'id' | 'secretKey'>) {
    const { sign, config } = this.jwtManager;
    const token = sign({ type: 'refresh', ...payload }, config.secret, {
      expiresIn: config.refreshExpiresIn,
    });
    return token;
  }

  async decodeToken<T extends AuthTokenPayload | SomeTokenPayload>(
    token: string,
    options?: VerifyOptions,
  ) {
    const { verify, config } = this.jwtManager;
    const payload = verify(token, config.secret, options);
    return payload as T;
  }
}
