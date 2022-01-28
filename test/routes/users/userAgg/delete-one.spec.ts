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

  it('should fail to delete another user', async () => {
    const anotherUser = await createRandomUser();

    const before = await hyperTest
      .get<UserOutput>(`/api/users/${anotherUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(before.isSuccess).toEqual(true);
    expect(before.user.id).toEqual(anotherUser.info.id);

    const res = await hyperTest
      .delete<ErrorOutput>(`/api/users/${anotherUser.info.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(false);

    const after = await hyperTest
      .get<UserOutput>(`/api/users/${anotherUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(after.isSuccess).toEqual(true);
    expect(after.user.id).toEqual(anotherUser.info.id);
  });

  it('should success to delete user (self)', async () => {
    const before = await hyperTest
      .get<UserOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(before.isSuccess).toEqual(true);
    expect(before.user.id).toEqual(randomUser.info.id);

    const res = await hyperTest
      .delete(`/api/users/${randomUser.info.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<ErrorOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(after.isSuccess).toEqual(false);
  });
};

export default tests;
