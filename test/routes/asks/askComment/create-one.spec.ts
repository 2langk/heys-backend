import { ErrorOutput } from 'src/common';
import { Ask } from 'src/entities';
import { AskOutput } from 'src/routes/asks/askAgg';
import { AskCommentOutput, CreateAskCommentDto } from 'src/routes/asks/askComment';
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

  const data: CreateAskCommentDto = {
    content: 'comments',
  };

  it('should fail to create comment (not exist post)', async () => {
    const res = await hyperTest
      .post<ErrorOutput>(`/api/asks/999/comments/`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to create post comment', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askComments.length).toEqual(0);

    const res = await hyperTest
      .post<AskCommentOutput>(`/api/asks/${targetAsk.id}/comments`)
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askComments.length).toEqual(1);
  });

  it('should success to create post subComment', async () => {
    const before = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(before.ask.askComments.length).toEqual(1);
    expect(before.ask.askComments[0].children.length).toEqual(0);

    const parent = before.ask.askComments[0];
    const res = await hyperTest
      .post<AskCommentOutput>(`/api/asks/${targetAsk.id}/comments`)
      .authToken(randomUser.accessToken)
      .data({ ...data, parentId: parent.id });

    expect(res.isSuccess).toEqual(true);

    const after = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(after.ask.askComments.length).toEqual(1);
    expect(after.ask.askComments[0].children.length).toEqual(1);
  });
};

export default tests;
