import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    hyperTest = await initHyperTest();
  });

  it('should fail to delete ask (not exist ask)', async () => {
    const res = await hyperTest
      .delete('/api/asks/999')
      .authToken(randomUser.accessToken)
      .data(emptyObj);

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to delete ask', async () => {
    const { id } = await createRandomAsk(randomUser.accessToken);

    const res = await hyperTest
      .delete(`/api/asks/${id}`)
      .authToken(randomUser.accessToken)
      .data(emptyObj);

    expect(res.isSuccess).toEqual(true);

    const confirm = await hyperTest
      .get(`/api/asks/${id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(confirm.isSuccess).toEqual(false);
  });

  it('should fail to delete ask (forbidden resource)', async () => {
    const anotherUser = await createRandomUser();
    const anotherUsersPost = await createRandomAsk(anotherUser.accessToken);

    const res = await hyperTest
      .delete(`/api/asks/${anotherUsersPost.id}`)
      .authToken(randomUser.accessToken)
      .data(emptyObj);

    expect(res.isSuccess).toEqual(false);

    const confirm = await hyperTest
      .get(`/api/asks/${anotherUsersPost.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(confirm.isSuccess).toEqual(true);
  });
};

export default tests;
