import { User as UserEntity } from 'src/entities';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Partial<UserEntity> {}

    // interface Request {
    //   user?: Partial<UserEntity>;
    // }
  }
}

/**
 * passport가 req.user의 타입을 Express.User로 잡고 있어서
 * Express.User의 타입을 확장하는 걸로 수정함
 */
