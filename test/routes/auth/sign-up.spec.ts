import { ErrorOutput } from 'src/common';
import { UserRoleEnum } from 'src/entities';
import { SignUpDto } from 'src/routes/auth/dtos/auth.dto';
import { AuthTokensOutput } from 'src/routes/auth/dtos/auth.output';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let hyperTest: HyperTest;
  beforeAll(async () => {
    hyperTest = await initHyperTest();
  });

  const data: SignUpDto = {
    email: 'test@test.com',
    name: 'test',
    password: 'password',
    role: UserRoleEnum.User,
  };

  it('should fail to sign-up (invalid user role)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>('/api/auth/signup')
      .authToken()
      .data({ ...data, role: 'www' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to sign-up', async () => {
    const res = await hyperTest
      .post<AuthTokensOutput>('/api/auth/signup')
      .authToken()
      .data({ ...data });

    expect(res.isSuccess).toEqual(true);
  });

  it('should fail to sign-up (duplicate email)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>('/api/auth/signup')
      .authToken()
      .data({ ...data });

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
