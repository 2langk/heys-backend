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
      .data(isTypeOf<CreateAskCommentDto>({ content: 'comment' }));

    targetAskComment = res.postComment;
  });

  const data: CreateAskCommentDto = {
    content: 'changed comment',
  };

  it('should success to update comment content', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askComments[0].content).not.toEqual(data.content);

    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}/comments/${targetAskComment.id}`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askComments[0].content).toEqual(data.content);
  });

  it('should fail to change comment`s parentId', async () => {
    const res = await hyperTest
      .put(`/api/asks/${targetAsk.id}/${targetAskComment.id}`)
      .authToken(randomUser.accessToken)
      .data({ parentId: 1, ...data });

    expect(res.isSuccess).toEqual(false);
  });
};

export default tests;
