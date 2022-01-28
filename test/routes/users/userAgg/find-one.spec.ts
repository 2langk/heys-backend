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

  it('should fail to find user info (not admin)', async () => {
    const res = await hyperTest
      .get<UserOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to find user info (admin)', async () => {
    const res = await hyperTest
      .get<UserOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(adminToken)
      .query();

    expect(res.isSuccess).toEqual(true);
    expect(res.user.id).toEqual(randomUser.info.id);
  });
};

export default tests;
