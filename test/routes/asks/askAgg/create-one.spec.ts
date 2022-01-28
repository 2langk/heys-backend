import { cloneDeep } from 'lodash';
import { AskOutput, CreateAskAggDto } from 'src/routes/asks/askAgg';
import { createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    hyperTest = await initHyperTest();
  });

  const validData: CreateAskAggDto = {
    title: 'title',
    content: 'content',
    creator: 'test',
  };

  it('should fail to create ask (invalid token)', async () => {
    const res = await hyperTest
      .post<AskOutput>('/api/asks')
      .authToken('invalid token')
      .data(validData);

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to create ask (without title)', async () => {
    const data = cloneDeep(validData);
    data.title = undefined;

    const res = await hyperTest
      .post<AskOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to create ask (without content)', async () => {
    const data = cloneDeep(validData);
    data.content = undefined;

    const res = await hyperTest
      .post<AskOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .data(data);

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to create asks', async () => {
    const res = await hyperTest
      .post<AskOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .data(validData);

    expect(res.isSuccess).toEqual(true);
  });
};

export default tests;
