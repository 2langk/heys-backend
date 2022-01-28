import { ErrorOutput } from 'src/common';
import { Ask } from 'src/entities';
import { AskOutput } from 'src/routes/asks/askAgg';
import { AskLikeOutput, CreateAskLikeDto } from 'src/routes/asks/askLike';
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

  const data: CreateAskLikeDto = { isLiked: true };

  it('should fail to create postLikes (not exist post)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>('/api/asks/999/likes')
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to create postLikes (invalid data)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>(`/api/asks/${targetAsk.id}/likes`)
      .authToken(randomUser.accessToken)
      .data({ isLiked: '123' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to create postLikes', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askLikes.length).toEqual(0);

    const res = await hyperTest
      .post<AskLikeOutput>(`/api/asks/${targetAsk.id}/likes`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askLikes.length).toEqual(1);
  });
};

export default tests;
