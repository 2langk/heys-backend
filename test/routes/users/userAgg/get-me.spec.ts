import { ErrorOutput } from 'src/common';
import { UserOutput } from 'src/routes/users/userAgg';
import { createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    hyperTest = await initHyperTest();
  });

  it('should fail to get my info (invalid token)', async () => {
    const res = await hyperTest
      .get<ErrorOutput>('/api/users/me')
      .authToken('invalid')
      .query(emptyObj);

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to get my info (user)', async () => {
    const res = await hyperTest
      .get<UserOutput>('/api/users/me')
      .authToken(randomUser.accessToken)
      .query();

    expect(res.isSuccess).toEqual(true);
  });

  it('should success to get my info (admin)', async () => {
    const res = await hyperTest
      .get<UserOutput>('/api/users/me')
      .authToken(global.adminToken)
      .query();

    expect(res.isSuccess).toEqual(true);
  });
};

export default tests;
