import { AES,enc } from "crypto-ts";
const key = process.env.ENCRYPTION_KEY as string;

export const encrypt = (data: string): string => {
  return AES.encrypt(data, key).toString();
};

export const decrypt = (data: string): string => {
  return AES.decrypt(data, key).toString(enc.Utf8);
};

export const validateChar = (data: string): boolean =>
  /[^a-zA-Z0-9.,:\-\s@]/g.test(data) ? true : false;
