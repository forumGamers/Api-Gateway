import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { Mutate, Query } from "../interfaces/request";

export type BaseResponse<T = any> = {
  data?: T;
  message?: string;
  code: number;
  "Content-Type": string;
  Path: string;
};

export type GoResponse<T = any> = {
  data?: T;
  message: string;
  code: number;
  status: string;
};

export type GoResponseWithMetadata<T = any> = GoResponse<T> & {
  total: number;
  page: any[];
  limit: number;
  relation: string;
};

class BaseRequest {
  protected axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = Axios.create({
      baseURL,
      headers: {
        Origin: process.env.ORIGIN,
      },
      validateStatus: () => true,
    });
  }

  protected async baseQuery<T = any>({
    url,
    headers,
    params,
  }: Query): Promise<AxiosResponse<T>> {
    return new Promise((resolve) => {
      this.axios<T>({
        url,
        headers,
        method: "GET",
        params,
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  }

  protected async baseMutate<T = any>({
    url,
    headers,
    data,
    method,
  }: Mutate): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      this.axios<T>({
        url,
        headers,
        data,
        method,
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default BaseRequest;
