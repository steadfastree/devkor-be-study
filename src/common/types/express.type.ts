import { AccessTokenPayload } from 'src/auth/dtos/access-token.payload';

declare global {
  namespace Express {
    export interface User extends AccessTokenPayload {}
  }
}
