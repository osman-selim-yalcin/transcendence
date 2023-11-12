import * as jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
}

export function createToken(tokenDetails: any) {
  const token = jwt.sign(tokenDetails, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '100h',
  });
  return token;
}
