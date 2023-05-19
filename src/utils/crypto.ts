import { createCipheriv, randomBytes, createDecipheriv } from "crypto";
const key = process.env.ENCRYPTION_KEY as string;

export const encrypt = (data: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-ocb", Buffer.from(key), iv);
  const encrypted = cipher.update(data);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  return Buffer.concat([iv, finalBuffer]).toString("base64");
};

export const decrypt = (data: string): string => {
  const encryptedBuffer = Buffer.from(data, "base64");
  const iv = encryptedBuffer.slice(0, 16);
  const encrypted = encryptedBuffer.slice(16);
  const decipher = createDecipheriv("aes-256-ocb", Buffer.from(key), iv);
  const decrypt = decipher.update(encrypted);
  const finalBuffer = Buffer.concat([decrypt, decipher.final()]);
  return finalBuffer.toString();
};

export const validateChar = (data: string): boolean =>
  /[^a-zA-Z0-9.,:\-\s@]/g.test(data) ? true : false;
