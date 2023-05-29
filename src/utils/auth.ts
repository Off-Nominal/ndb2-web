import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "";

type AppJWTPayload = {
  name: string;
  avatarUrl: string;
  discordId: string;
};

const isAppJWTPayload = (val: jose.JWTPayload): val is AppJWTPayload => {
  if (typeof val !== "object") {
    return false;
  }

  if (!("name" in val) || !("avatarUrl" in val) || !("discordId" in val)) {
    return false;
  }

  if (
    typeof val.name !== "string" ||
    typeof val.avatarUrl !== "string" ||
    typeof val.discordId !== "string"
  ) {
    return false;
  }

  return true;
};

const sign = (payload: any): Promise<string> => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // one day

  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(JWT_SECRET));
};

const verify = async (): Promise<AppJWTPayload | null> => {
  const token = cookies().get("token")?.value || "";

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (!isAppJWTPayload(payload)) {
      return null;
    }

    return {
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      discordId: payload.discordId,
    };
  } catch (err) {
    return null;
  }
};

const authAPI = {
  sign,
  verify,
};

export default authAPI;
