import JWT from 'jsonwebtoken';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, "../.env") });

  export const jwtGenerator = (_id: string, isAdmin: string ) => {
  const payload = {
    user: _id,
    adm: isAdmin
  };

  return JWT.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "2h" });
}