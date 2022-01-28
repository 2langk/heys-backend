import { AskOutput } from 'src/routes/asks/askAgg';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    hyperTest = await initHyperTest();
  });

  it('should fail to find ask (not exist ask)', async () => {
    const res = await hyperTest
      .get<AskOutput>('/api/asks/999')
      .authToken(randomUser.accessToken)
      .query();

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to find ask by askId', async () => {
    const targetAsk = await createRandomAsk(randomUser.accessToken);

    const res = await hyperTest
      .get<AskOutput>(`/api/asks/${targetAsk.id}`)
      .authToken(randomUser.accessToken)
      .query();

    expect(res.ask.id).toEqual(targetAsk.id);
  });
};

export default tests;
