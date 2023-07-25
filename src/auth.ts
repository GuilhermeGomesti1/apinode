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

export function decodeToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.log("Erro ao decodificar o token:", (error as Error).message);
    throw new Error("Invalid token: unable to decode");
  }
}

function generateToken(payload: TokenPayload): string {
  console.log("Secret Key:", secretKey);
  const token = jwt.sign(payload, secretKey as Secret,);
  return token;
}

export { generateToken };