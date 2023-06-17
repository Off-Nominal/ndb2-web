import { add } from "date-fns";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import discordAPI from "@/utils/discord";
import authAPI from "@/utils/auth";
import { RESTGetAPIGuildMemberResult } from "discord-api-types/v10";
import { APIAuth } from "@/types/user";
import envVars from "@/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (typeof code !== "string") {
    return NextResponse.redirect(discordAPI.oAuthUrl);
  }

  let access_token: string;

  try {
    const response = await discordAPI.authenticate(code);
    access_token = response.access_token;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(envVars.APP_URL + "/signin?error=auth");
  }

  let member: RESTGetAPIGuildMemberResult;

  try {
    member = await discordAPI.identify(access_token);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(envVars.APP_URL + "/signin?error=identify");
  }

  let user: APIAuth.User | null;

  try {
    const response = await discordAPI.authorize(member);
    if (response.error) {
      throw new Error(response.error);
    } else {
      user = response.user;
    }
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(envVars.APP_URL + "/signin?error=authorize");
  }

  try {
    const token = await authAPI.sign(user);

    // NEXT JS has a bug where it doesn't recognize the typing for the set method inside a server route
    // This comment written while on Next.JS v 13.4.2
    // @ts-ignore
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      expires: add(new Date(), { days: 30 }),
      sameSite: "lax",
    });
  } catch (err) {
    console.error(err);
  }

  return NextResponse.redirect(envVars.APP_URL);
}
