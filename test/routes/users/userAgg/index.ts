import deleteOneTest from './delete-one.spec';
import findOneTest from './find-one.spec';
import getMeTest from './get-me.spec';
import updateOneTest from './update-one.spec';

const UserAggTest = () => {
  describe('[GET] /api/users/me', getMeTest);
  describe('[GET] /api/users/:id', findOneTest);
  describe('[PUT] /api/users/:id', updateOneTest);
  describe('[DELETE] /api/users/:id', deleteOneTest);
};

export default UserAggTest;
