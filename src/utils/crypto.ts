import { AES, enc } from "crypto-ts";
const key = process.env.ENCRYPTION_KEY as string;

export const encrypt = (data: string): string => {
  return AES.encrypt(data.replace(/\s/g, "_"), key).toString();
};

export const decrypt = (data: string): string => {
  return AES.decrypt(data, key).toString(enc.Utf8).replace(/_/g, " ");
};

export const validateChar = (data: string): boolean =>
  /[^a-zA-Z0-9.,_:*#\-\s@]/g.test(data);
