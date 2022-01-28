import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiDefinition, CurrUser } from 'src/common';
import { AuthService } from './auth.service';
import { RefreshAccessTokenDto, SignInDto, SignUpDto } from './dtos/auth.dto';
import { AuthTokensOutput } from './dtos/auth.output';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiDefinition({ summary: '회원가입하기', response: AuthTokensOutput, isPublic: true })
  async signUpUser(@Body() data: SignUpDto): Promise<AuthTokensOutput> {
    const { accessToken, refreshToken } = await this.authService.signUpUser(data);
    return { accessToken, refreshToken };
  }

  @Post('/signin')
  @ApiDefinition({ summary: '로그인하기', response: AuthTokensOutput, isPublic: true })
  async signInUser(@Body() data: SignInDto): Promise<AuthTokensOutput> {
    const { accessToken, refreshToken } = await this.authService.signInUser(data);
    return { accessToken, refreshToken };
  }

  @Post('/refresh-token')
  @ApiDefinition({
    summary: '리프레쉬 토큰으로 엑세스 토큰 새로 발급받기',
    response: AuthTokensOutput,
    isPublic: true,
  })
  async refreshAccessToken(@Body() data: RefreshAccessTokenDto): Promise<AuthTokensOutput> {
    const refreshedAccessToken = await this.authService.refreshAccessToken(data);
    return { accessToken: refreshedAccessToken };
  }

  // @Get('/signin/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // @ApiDefinition({ summary: '카카오 계정으로 회원가입/로그인', isPublic: true })
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async loginByKakao() {}

  // @Get('/signin/kakao/callback')
  // @UseGuards(AuthGuard('kakao'))
  // @ApiDefinition({ summary: '(웹훅) 카카오 회원가입/로그인 콜백', isPublic: true })
  // async loginByKakaoCallback(@Res() res: Response, @CurrUser() token: any) {
  //   res.send(token); // TODO: res.redirect()
  // }
}
