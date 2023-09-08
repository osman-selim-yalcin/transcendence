import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Room } from 'src/typeorm/Room';

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.accessTokenSecret, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
}
