import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

export interface TokenPayload {
  userId: string;
 
 
}
const secretKey = process.env.JWT_SECRET_KEY;

if (!secretKey) {
  throw new Error('JWT_SECRET_KEY not found in .env file');
} else {
  console.log('JWT_SECRET_KEY found:', secretKey);
}

function generateToken(payload: TokenPayload): string {
  console.log("Secret Key:", secretKey);
  const token = jwt.sign(payload, secretKey as Secret,);
  return token;
}

export { generateToken };