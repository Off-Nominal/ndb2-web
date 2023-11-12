import { add } from "date-fns";
import * as jose from "jose";
import {
  RequestCookie,
  ResponseCookie,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "";
const COOKIE_EXPIRY_IN_DAYS = 60;

export type AppJWTPayload = {
  name: string;
  avatarUrl: string;
  discordId: string;
  iat: number;
  exp: number;
};

const buildCookie = (token: string): ResponseCookie => {
  return {
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    expires: add(new Date(), { days: COOKIE_EXPIRY_IN_DAYS }),
    sameSite: "lax",
  };
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
  const exp = iat + 24 * 60 * 60 * COOKIE_EXPIRY_IN_DAYS;

  return new jose.SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(JWT_SECRET));
};

const verify = async (
  cookie: RequestCookie | undefined
): Promise<AppJWTPayload | null> => {
  if (!cookie) {
    return null;
  }

  const token = cookie.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (!isAppJWTPayload(payload)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const authAPI = {
  sign,
  verify,
  buildCookie,
};

export default authAPI;
