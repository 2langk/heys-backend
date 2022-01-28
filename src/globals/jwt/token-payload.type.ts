import { JwtPayload } from 'jsonwebtoken';

/** JwtPaylod의 [key: string]: any 때문에 */
export type AuthTokenPayload = {
  type: 'access' | 'refresh';
  id: number;
  secretKey: string;
} & {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
};

export type SomeTokenPayload = {
  be: string;
} & JwtPayload;
