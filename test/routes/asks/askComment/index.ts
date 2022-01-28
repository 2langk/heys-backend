import createOneTest from './create-one.spec';
import deleteOneTest from './delete-one.spec';
import updateOneTest from './update-one.spec';

const PostLikeTest = () => {
  describe('[POST] /api/asks/:askId/comments => createOneTest', createOneTest);
  describe('[PUT] /api/asks/:askId/comments/:id => updateOneTest', updateOneTest);
  describe('[DELETE] /api/asks/:askId/comments/:id => deleteOneTest', deleteOneTest);
};

export default PostLikeTest;
