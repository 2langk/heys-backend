import createOneTest from './create-one.spec';
import deleteOneTest from './delete-one.spec';
import updateOneTest from './update-one.spec';

const PostLikeTest = () => {
  describe('[POST] /api/posts/:postId/likes => createOneTest', createOneTest);
  describe('[PUT] /api/posts/:postId/likes/:id => updateOneTest', updateOneTest);
  describe('[DELETE] /api/posts/:postId/likes/:id => deleteOneTest', deleteOneTest);
};

export default PostLikeTest;
