import { Ask } from 'src/entities';
import { AskOutput, UpdateAskAggDto } from 'src/routes/asks/askAgg';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let targetAsk: Ask;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    targetAsk = await createRandomAsk(randomUser.accessToken);
    hyperTest = await initHyperTest();
  });

  const data: UpdateAskAggDto = {
    title: 'changed title',
    content: 'changed content',
  };

  it('should fail to update ask (not exist ask)', async () => {
    const res = await hyperTest
      .put('/api/asks/999')
      .authToken(randomUser.accessToken)
      .data({ ...data });

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to update ask (include invalid data)', async () => {
    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .data({ ...data, invalid: 'invalid' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to update title', async () => {
    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .data({ title: data.title });

    expect(res.isSuccess).toEqual(true);

    const confirm = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(confirm.ask.title).toEqual(data.title);
  });

  it('should success to update content', async () => {
    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .data({ content: data.content });

    expect(res.isSuccess).toEqual(true);

    const confirm = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(confirm.ask.content).toEqual(data.content);
  });

  it('should fail to update ask (forbidden resource)', async () => {
    const anotherUser = await createRandomUser();
    const anotherUsersPost = await createRandomAsk(anotherUser.accessToken);

    const res = await hyperTest
      .put(`/api/asks/${anotherUsersPost.id}`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
