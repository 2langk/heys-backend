import { ErrorOutput } from 'src/common';
import { UserRoleEnum } from 'src/entities';
import { UserOutput } from 'src/routes/users/userAgg';
import { UpdateUserAggDto } from 'src/routes/users/userAgg/dtos/userAgg.dto';
import { createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    hyperTest = await initHyperTest();
  });

  const data: UpdateUserAggDto = {
    role: UserRoleEnum.User,
    name: 'changed name',
  };

  it('should fail to update user (not authorized)', async () => {
    const res = await hyperTest
      .put<ErrorOutput>(`/api/users/${randomUser.info.id}`)
      .authToken('invalid')
      .data({ ...data });

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to update user (invalid role data)', async () => {
    const res = await hyperTest
      .put<ErrorOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .data({ role: 'invalid' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to update user (not allowed data)', async () => {
    const res = await hyperTest
      .put(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .data({ ...data, black: 'list' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to update name (admin)', async () => {
    const before = await hyperTest
      .get<UserOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(before.user.name).not.toEqual(data.name);

    const res = await hyperTest
      .put(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .data(data);

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<UserOutput>(`/api/users/${randomUser.info.id}`)
      .authToken(global.adminToken)
      .query();

    expect(after.user.name).toEqual(data.name);
  });
};

export default tests;
