import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyFunction } from 'passport-kakao';
import { AuthService } from '../auth.service';

type VerifyFunctionParams = Parameters<VerifyFunction>;

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  public constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['profile', 'account_email', 'gender', 'age_range', 'birthday'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: VerifyFunctionParams['2'],
    done: VerifyFunctionParams['3'],
  ) {
    const { id: oauthId, username: name } = profile;

    let authTokens = await this.authService.loginKakaoUser(oauthId, refreshToken);
    if (!authTokens) {
      authTokens = await this.authService.createKakaoUser({
        name,
        phone: '123', // TODO
        oauthId,
        accessToken,
        refreshToken,
      });
    }

    return done(null, authTokens); // done: req.user에 authTokens을 할당(Trick)
  }
}
