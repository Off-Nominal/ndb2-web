import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "";

export class AuthClient {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = JWT_SECRET;
  }

  sign(payload: any): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 24 * 60 * 60; // one day

    return new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(JWT_SECRET));
  }

  async verify() {
    const token = cookies().get("token")?.value || "";

    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return payload;
  }
}
