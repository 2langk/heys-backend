import { isTypeOf } from 'src/@utils';
import { Ask, AskComment } from 'src/entities';
import { AskOutput } from 'src/routes/asks/askAgg';
import { AskCommentOutput, CreateAskCommentDto } from 'src/routes/asks/askComment';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let targetAsk: Ask;
  let targetAskComment: AskComment;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    targetAsk = await createRandomAsk(randomUser.accessToken);
    hyperTest = await initHyperTest();

    const res = await hyperTest
      .post<AskCommentOutput>(`/api/asks/${targetAsk.id}/comments`)
      .authToken(randomUser.accessToken)
      .data(isTypeOf<CreateAskCommentDto>({ content: 'content' }));

    targetAskComment = res.postComment;
  });

  it('should success to delete comment', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askComments.length).toEqual(1);

    const res = await hyperTest
      .delete(`/api/asks/${targetAsk.id}/comments/${targetAskComment.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askComments.length).toEqual(0);
  });

  it('should fail to delete other`s comment', async () => {
    const anotherUser = await createRandomUser();
    const { postComment: anotherUserComment } = await hyperTest
      .post<AskCommentOutput>(`/api/asks/${targetAsk.id}/comments`)
      .authToken(anotherUser.accessToken)
      .data(isTypeOf<CreateAskCommentDto>({ content: 'content' }));

    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askComments.length).toEqual(1);

    const res = await hyperTest
      .delete(`/api/asks/${targetAsk.id}/comments/${anotherUserComment.id}`)
      .authToken(randomUser.accessToken)
      .data();

    expect(res.isSuccess).toEqual(false);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askComments.length).toEqual(1);
  });
};

export default tests;
