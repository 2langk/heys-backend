import { ErrorOutput } from 'src/common';
import { JwtService } from 'src/globals';
import { RefreshAccessTokenDto } from 'src/routes/auth/dtos/auth.dto';
import { AuthTokensOutput } from 'src/routes/auth/dtos/auth.output';
import { UserOutput } from 'src/routes/users/userAgg';
import { createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest, testApp } from 'test/hyperTest';

const tests = () => {
  /**
   * 이 구역은 setup.ts beforeAll() 보다 먼저 실행됨
   * (global.accessToken === undefined인 상태)
   *  */

  let randomUser: RandomUser;
  let expiredAccessToken: string;
  let expiredRefreshToken: string;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();

    const jwtService = await (await testApp).resolve(JwtService);
    expiredAccessToken = await jwtService.generateExpiredAuthToken(randomUser.accessToken);
    expiredRefreshToken = await jwtService.generateExpiredAuthToken(randomUser.refreshToken);

    await new Promise((r) => setTimeout(r, 1000));

    hyperTest = await initHyperTest();
  });

  it('should fail to get me (expired accessToken)', async () => {
    const res = await hyperTest
      .get<ErrorOutput>('/api/users/me')
      .authToken(expiredAccessToken)
      .query();

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to get me (valid accessToken)', async () => {
    const res = await hyperTest
      .get<UserOutput>('/api/users/me')
      .authToken(randomUser.accessToken)
      .query(emptyObj);

    expect(res.isSuccess).toEqual(true);
  });

  it('should fail to refresh accessToken (expired refreshToken)', async () => {
    const data: RefreshAccessTokenDto = {
      accessToken: expiredAccessToken,
      refreshToken: expiredRefreshToken,
    };

    const res = await hyperTest
      .post<ErrorOutput>('/auth/refresh-token')
      .authToken()
      .data({ ...data });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to refresh accessToken (with valid accessToken)', async () => {
    const data: RefreshAccessTokenDto = {
      accessToken: randomUser.accessToken,
      refreshToken: randomUser.refreshToken,
    };

    const res = await hyperTest
      .post<AuthTokensOutput>('/api/auth/refresh-token')
      .authToken()
      .data(data);

    expect(res.isSuccess).toEqual(true);
  });

  it('should success to refresh accessToken (with expired accessToken)', async () => {
    const data: RefreshAccessTokenDto = {
      accessToken: expiredAccessToken,
      refreshToken: randomUser.refreshToken,
    };

    const res = await hyperTest
      .post<AuthTokensOutput>('/api/auth/refresh-token')
      .authToken()
      .data(data);

    expect(res.isSuccess).toEqual(true);
  });

  it('should fail to refresh accessToken (with others accessToken)', async () => {
    const anotherUser = await createRandomUser();
    const data: RefreshAccessTokenDto = {
      accessToken: anotherUser.accessToken,
      refreshToken: randomUser.refreshToken,
    };

    const res = await hyperTest
      .post<ErrorOutput>('/api/auth/refresh-token')
      .authToken()
      .data({ ...data });

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
