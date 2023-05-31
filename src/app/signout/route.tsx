import envVars from "@/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // NEXT JS has a bug where it doesn't recognize the typing for the set method inside a server route
  // This comment written while on Next.JS v 13.4.2
  // @ts-ignore
  cookies().set({
    name: "token",
    value: undefined,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    expires: -1,
    sameSite: "lax",
  });

  return NextResponse.redirect(envVars.APP_URL + "/signin");
}
