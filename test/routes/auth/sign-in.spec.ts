import { ErrorOutput } from 'src/common';
import { SignInDto } from 'src/routes/auth/dtos/auth.dto';
import { AuthTokensOutput } from 'src/routes/auth/dtos/auth.output';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let hyperTest: HyperTest;
  beforeAll(async () => {
    hyperTest = await initHyperTest();
  });

  const data: SignInDto = {
    email: 'test@test.com',
    password: 'password',
  };

  it('should fail to sign-in (invalid email)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>('/api/auth/signin')
      .authToken()
      .data({
        ...data,
        email: 'invalid@invalid.com',
      });

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to sign-in (invalid password)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>('/api/auth/signin')
      .authToken()
      .data({
        ...data,
        passowrd: 'invalid',
      });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to sign-in', async () => {
    const res = await hyperTest
      .post<AuthTokensOutput>('/api/auth/signin')
      .authToken()
      .data({ ...data });

    expect(res.isSuccess).toEqual(true);
  });
};

export default tests;
