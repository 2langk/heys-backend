// import { ErrorOutput } from 'src/common';
// import { Post } from 'src/entities';
// import { createRandomPost, createRandomUser, RandomUser } from 'test/@utils';
// import { HyperTest, initHyperTest } from 'test/hyperTest';

// const tests = () => {
//   let randomUser: RandomUser;
//   let targetPost: Post;
//   let hyperTest: HyperTest;
//   beforeAll(async () => {
//     randomUser = await createRandomUser();
//     targetPost = await createRandomPost(randomUser.accessToken);
//     hyperTest = await initHyperTest();
//   });

//   it('should fail to find post (not exist post)', async () => {
//     const res = await hyperTest
//       .get<ErrorOutput>('/api/posts/999')
//       .authToken(randomUser.accessToken)
//       .query();

//     expect(res.isSuccess).toEqual(false);
//   });
// };

// export default tests;
