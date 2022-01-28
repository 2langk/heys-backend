import { isTypeOf } from 'src/@utils';
import { UserRoleEnum } from 'src/entities';
import { SignUpDto } from 'src/routes/auth/dtos/auth.dto';
import { AuthTokensOutput } from 'src/routes/auth/dtos/auth.output';
import { getConnection } from 'typeorm';
import { HyperTest, initHyperTest, testApp } from './hyperTest';
import AskControllerTest from './routes/asks';
import AuthControllerTest from './routes/auth';
import UserControllerTest from './routes/users';

describe('------ Start E2E Test ------', () => {
  let hyperTest: HyperTest;
  beforeAll(async () => {
    hyperTest = await initHyperTest();
    await setupTest(hyperTest);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await (await testApp).close();
  });

  describe('\n#1 Auth Controller Test', AuthControllerTest);
  describe('\n#2 User Controller Test', UserControllerTest);
  describe('\n#3 Ask Controller Test', AskControllerTest);
});

/** Setup */
async function setupTest(hyperTest: HyperTest) {
  const { accessToken: adminToken } = await hyperTest
    .post<AuthTokensOutput>('/api/auth/signup')
    .authToken()
    .data(
      isTypeOf<SignUpDto>({
        email: 'admin@admin.com',
        password: '12341234',
        name: 'admin',
        role: UserRoleEnum.Admin,
      }),
    );

  global.adminToken = adminToken;
  global.emptyObj = {};
}
