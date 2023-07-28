import { JwtPayload, Secret, verify, sign } from "jsonwebtoken";
const SECRET = process.env.SECRET as Secret;
const API_ACCESS = process.env.API_ACCESS as Secret;

export const createToken = (payload: object): string =>
  sign(payload, SECRET, { algorithm: "HS256" });

export const verifyToken = (token: string | any): JwtPayload =>
  verify(token, SECRET, { algorithms: ["HS256"] }) as JwtPayload;

export const API_Access_Token = (): string =>
  sign(
    {
      Origin: process.env.ORIGIN,
      time: new Date().toString(),
    },
    API_ACCESS,
    { algorithm: "HS256", expiresIn: "1m" }
  );
