import * as jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.accessTokenSecret, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
}

export function createToken(tokenDetails: any) {
  const token = jwt.sign(tokenDetails, process.env.accessTokenSecret, {
    expiresIn: '1h',
  });
  return token;
}
