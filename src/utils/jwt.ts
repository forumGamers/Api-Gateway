import {
  JwtPayload,
  Secret,
  sign,
  SignOptions,
  verify,
  decode,
} from "jsonwebtoken";

export interface jwtValue extends JwtPayload {
  UUID: string;
  loggedAs: "User" | "Admin" | "Seller";
}

export default new (class JWT {
  private secret: Secret;

  constructor() {
    this.secret = process.env.SECRET as Secret;
  }

  public createToken(
    data: { UUID: string; loggedAs: "User" | "Admin" | "Seller" },
    options?: SignOptions
  ) {
    return sign({ ...data }, this.secret, options);
  }

  public verifyToken(token: string) {
    return verify(token, this.secret) as jwtValue;
  }

  public decodeToken(token: string) {
    return decode(token) as jwtValue;
  }
})();
