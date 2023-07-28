export type MutateMethod = "POST" | "PATCH" | "DELETE" | "PUT";

export type Query = {
  url: string;
  headers?: Record<string, any>;
  params?: Record<string, any>;
};

export type Mutate = {
  url: string;
  headers?: Record<string, any>;
  data?: any;
  method: MutateMethod;
};
