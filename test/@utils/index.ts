import { generateAlphaString } from 'src/@utils';
import { User, UserRoleEnum } from 'src/entities';
import { AskOutput, CreateAskAggDto } from 'src/routes/asks/askAgg';
import { SignUpDto } from 'src/routes/auth/dtos/auth.dto';
import { AuthTokensOutput } from 'src/routes/auth/dtos/auth.output';
import { UserOutput } from 'src/routes/users/userAgg';
import { initHyperTest } from 'test/hyperTest';

// export type RandomUser = Awaited<ReturnType<typeof createRandomUser>>;
export type RandomUser = {
  accessToken: string;
  refreshToken: string;
  info: User;
};

export const createRandomUser = async () => {
  const hyperTest = await initHyperTest();

  const data: SignUpDto = {
    email: `${generateAlphaString(5)}@${generateAlphaString(5)}.com`,
    name: generateAlphaString(5),
    role: UserRoleEnum.User,
    password: '12341234',
  };

  const { accessToken, refreshToken } = await hyperTest
    .post<AuthTokensOutput>('/api/auth/signup')
    .authToken()
    .data(data);

  const res = await hyperTest
    .get<UserOutput>('/api/users/me')
    .authToken(accessToken)
    .query(emptyObj)
    .catch(() => console.log('fail to createRandomUser'));

  if (typeof res === 'undefined') return;

  return {
    accessToken,
    refreshToken,
    info: res.user,
  };
};

export const createRandomAsk = async (accessToken: string) => {
  const hyperTest = await initHyperTest();

  const data: CreateAskAggDto = {
    title: generateAlphaString(10),
    content: generateAlphaString(100),
    creator: generateAlphaString(8),
  };

  const res = await hyperTest
    .post<AskOutput>('/api/asks')
    .authToken(accessToken)
    .data({ ...data })
    .catch(() => console.log('fail to createRandomPost'));

  if (typeof res === 'undefined') return;

  return res.ask;
};
