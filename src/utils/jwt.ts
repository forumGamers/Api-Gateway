import { JwtPayload, Secret, verify, sign } from "jsonwebtoken";
const SECRET = process.env.SECRET as Secret;

export const createToken = (payload: object): string =>
  sign(payload, SECRET, { algorithm: "HS256" });

export const verifyToken = (token: string | any): JwtPayload =>
  verify(token, SECRET, { algorithms: ["HS256"] }) as JwtPayload;
