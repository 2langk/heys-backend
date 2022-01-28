import { FindAllQueryDto } from 'src/entities/@queries';
import { AsksOutput } from 'src/routes/asks/askAgg';
import { createRandomAsk, createRandomUser, RandomUser } from 'test/@utils';
import { HyperTest, initHyperTest } from 'test/hyperTest';

const tests = () => {
  let randomUser: RandomUser;
  let hyperTest: HyperTest;
  beforeAll(async () => {
    randomUser = await createRandomUser();
    await createRandomAsk(randomUser.accessToken);
    await createRandomAsk(randomUser.accessToken);
    await createRandomAsk(randomUser.accessToken);
    hyperTest = await initHyperTest();
  });

  // TODO: query test
  const query: FindAllQueryDto = {
    limit: '3',
    page: '1',
  };

  it('should fail to find post (invalid query params)', async () => {
    const res = await hyperTest
      .get<AsksOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .query({ ...query, invalid: 'invalid' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should fail to find post (invalid query search type)', async () => {
    const res = await hyperTest
      .get<AsksOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .query({ ...query, search: 'invalid' });

    expect(res.isSuccess).toEqual(false);
  });

  it('should success to find post (without query params)', async () => {
    const res = await hyperTest
      .get<AsksOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .query();

    expect(res.isSuccess).toEqual(true);
  });

  it('should success to find post (with query)', async () => {
    const res = await hyperTest
      .get<AsksOutput>('/api/asks')
      .authToken(randomUser.accessToken)
      .query(query);

    expect(res.isSuccess).toEqual(true);
    expect(res.asks.length).toBeLessThanOrEqual(+query.limit);
  });
};

export default tests;
