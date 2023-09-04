import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.accessTokenSecret, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
}
