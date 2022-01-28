import refreshTokenTest from './refresh-token.spec';
import signInTest from './sign-in.spec';
import signUpTest from './sign-up.spec';

const AuthControllerTest = () => {
  describe('[POST] /api/auth/signup => signUpTest', signUpTest);
  describe('[POST] /api/auth/signin => signInTest', signInTest);
  describe('[POST] /api/auth/refresh-token => refreshTokenTest', refreshTokenTest);
};

export default AuthControllerTest;
