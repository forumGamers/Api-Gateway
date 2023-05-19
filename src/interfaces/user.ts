export type registerInput = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type loginInput = {
  email: string;
  password: string;
};

export type tokenVerification = {
  token: string;
};
