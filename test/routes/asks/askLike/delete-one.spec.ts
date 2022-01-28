import { ErrorOutput } from 'src/common';
import { Ask, AskLike } from 'src/entities';
import { AskOutput } from 'src/routes/asks/askAgg';
import { AskLikeOutput } from 'src/routes/asks/askLike';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let targetPost: Ask;
  let targetAskLike: AskLike;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    targetPost = await createRandomAsk(randomUser.accessToken);
    hyperTest = await initHyperTest();

    const res = await hyperTest
      .post<AskLikeOutput>(`/api/asks/${targetPost.id}/likes`)
      .authToken(randomUser.accessToken)
      .data({ isLiked: true });

    targetAskLike = res.askLike;
  });

  it('should fail to delete postLikes (not exist postLikes)', async () => {
    const res = await hyperTest
      .delete<ErrorOutput>(`/api/asks/${targetPost.id}/likes/999`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to delete postLikes', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetPost.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askLikes.length).toEqual(1);

    const res = await hyperTest
      .delete(`/api/asks/${targetPost.id}/likes/${targetAskLike.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetPost.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askLikes.length).toEqual(0);
  });

  it('should fail to delete postLikes (not owner)', async () => {
    const anotherUser = await createRandomUser();
    const { askLike: anotherUsersAskLike } = await hyperTest
      .post<AskLikeOutput>(`/api/asks/${targetPost.id}/likes`)
      .authToken(anotherUser.accessToken)
      .data({ isLiked: true });

    const res = await hyperTest
      .delete<ErrorOutput>(`/api/asks/${targetPost.id}/likes/${anotherUsersAskLike.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
