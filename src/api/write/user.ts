import { userWriteURL } from "../../constants";
import BaseRequest, { BaseResponse } from "../request";
import { message } from "../../interfaces";
import { registerInput, userInstance } from "../../interfaces/user";

export default new (class UserWrite extends BaseRequest {
  constructor() {
    super(userWriteURL);
  }

  public async loginHandler({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const { data, status } = await this.baseMutate<
      BaseResponse<{ access_token: string }>
    >({
      url: "/auth/login",
      data: {
        email,
        password,
      },
      method: "POST",
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return { access_token: data.data?.access_token as string };
  }

  public async googleLogin(
    access_token: string
  ): Promise<{ access_token: string }> {
    const { data, status } = await this.baseMutate<
      BaseResponse<{ access_token: string }>
    >({
      method: "POST",
      url: "/auth/google-login",
      headers: {
        google_token: access_token,
      },
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return { access_token: data.data?.access_token as string };
  }

  public async resetPassword(email: string): Promise<string> {
    const { data, status } = await this.baseMutate<BaseResponse<string>>({
      method: "POST",
      url: "/auth/reset-password",
      data: { email },
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return data.data as string;
  }

  public async changeForgetPassword(
    payload: {
      password: string;
      confirmPassword: string;
    },
    access_token: string
  ) {
    const { data, status } = await this.baseMutate<BaseResponse>({
      method: "PATCH",
      url: "/auth/change-forget-pass",
      data: payload,
      headers: { access_token },
    });

    if (status !== 200) {
      const { message } = data as message;

      throw { message };
    }

    return data;
  }

  public async verifyUser(token: string) {
    const { data, status } = await this.baseMutate<BaseResponse>({
      method: "PATCH",
      url: `/auth/verify?token=${token}`,
    });

    if (status !== 200) {
      const { message } = data;

      throw { message };
    }

    return data;
  }

  public async register(data: registerInput) {
    const { data: response, status } = await this.baseMutate<
      BaseResponse<userInstance>
    >({
      method: "POST",
      url: "/auth/register",
      data,
    });

    if (status !== 201) throw { message: response.message };

    return response.data as userInstance;
  }

  public async updateProfileImg(formData: FormData, access_token?: string) {
    const { data } = await this.baseMutate<BaseResponse>({
      url: "/user/profile-img",
      method: "POST",
      headers: {
        access_token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    return data.message;
  }

  public async updateBackgroundImg(formData: FormData, access_token?: string) {
    const { data } = await this.baseMutate<BaseResponse>({
      url: "/user/background-img",
      method: "POST",
      headers: {
        access_token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    return data.message;
  }

  public async updateUserInfo(
    payload: { username?: string; bio?: string },
    access_token?: string
  ) {
    const { data, status } = await this.baseMutate<BaseResponse>({
      method: "PATCH",
      url: "/user/info",
      headers: {
        access_token,
      },
      data: payload,
    });

    if (status !== 200) throw { message: data.message };

    return data.message;
  }
})();
