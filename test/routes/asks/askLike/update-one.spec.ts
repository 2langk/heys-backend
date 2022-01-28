import { ErrorOutput } from 'src/common';
import { Ask, AskLike } from 'src/entities';
import { AskOutput } from 'src/routes/asks/askAgg';
import { AskLikeOutput, UpdateAskLikeDto } from 'src/routes/asks/askLike';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let targetAsk: Ask;
  let targetAskLike: AskLike;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    targetAsk = await createRandomAsk(randomUser.accessToken);
    hyperTest = await initHyperTest();

    const res = await hyperTest
      .post<AskLikeOutput>(`/api/asks/${targetAsk.id}/likes`)
      .authToken(randomUser.accessToken)
      .data({ isLiked: true });

    targetAskLike = res.askLike;
  });

  const data: UpdateAskLikeDto = { isLiked: false };

  it('should fail to update askLike (not exist askLike)', async () => {
    const res = await hyperTest
      .put<ErrorOutput>(`/api/asks/${targetAsk.id}/likes/999`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to update askLike (invalid data)', async () => {
    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}/likes/${targetAskLike.id}`)
      .authToken(randomUser.accessToken)
      .data({ isLiked: '123' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to update askLike (as false)', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askLikes.length).toEqual(1);
    expect(before.ask.askLikes[0].isLiked).toEqual(true);

    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}/likes/${targetAskLike.id}`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askLikes.length).toEqual(1);
    expect(after.ask.askLikes[0].isLiked).toEqual(false);
  });

  it('should fail to update askLike (not owner)', async () => {
    const anotherUser = await createRandomUser();
    const { askLike: anotherUsersAskLike } = await hyperTest
      .post<AskLikeOutput>(`/api/asks/${targetAsk.id}/likes`)
      .authToken(anotherUser.accessToken)
      .data({ isLiked: true });

    const res = await hyperTest
      .put<ErrorOutput>(`/api/asks/${targetAsk.id}/likes/${anotherUsersAskLike.id}`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
