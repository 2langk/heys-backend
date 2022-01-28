import createOneTest from './create-one.spec';
import deleteOneTest from './delete-one.spec';
import findAllTest from './find-all.spec';
import findOneTest from './find-one.spec';
import updateOneTest from './update-one.spec';

const PostAggTest = () => {
  describe('[POST] /api/asks => createOneTest', createOneTest);
  describe('[GET] /api/asks/:id => findOneTest', findOneTest);
  describe('[GET] /api/asks => findAllTest', findAllTest);
  describe('[PUT] /api/asks/:id => updateOneTest', updateOneTest);
  describe('[DELETE] /api/asks/:id => deleteOneTest', deleteOneTest);
};

export default PostAggTest;
