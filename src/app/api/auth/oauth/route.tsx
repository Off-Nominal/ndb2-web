import { add } from "date-fns";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import discordAPI from "@/utils/discord";
import authAPI from "@/utils/auth";
import { RESTGetAPIGuildMemberResult } from "discord-api-types/v10";
import { APIAuth } from "@/types/user";
import envVars from "@/config";
import crypto from "crypto";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  // If there is no code, redirect to the Discord OAuth page
  if (typeof code !== "string") {
    // This is the path that the user will be redirected to after they sign in
    const returnToPath = searchParams.get("returnTo");

    const state = {
      returnTo: returnToPath || "/",
      nonce: crypto.randomBytes(16).toString("hex") + Date.now().toString(),
    };

    const cookie = Buffer.from(JSON.stringify(state)).toString("base64");

    cookies().set("state", cookie, {
      expires: add(new Date(), { minutes: 5 }),
    });

    return NextResponse.redirect(discordAPI.getOAuthUrl(state.nonce));
  }

  let access_token: string;

  const nonce = searchParams.get("state");
  const cookie = cookies().get("state");

  if (
    typeof nonce !== "string" ||
    !cookie ||
    typeof cookie.value !== "string"
  ) {
    return NextResponse.redirect(envVars.APP_URL + "/signin?error=state");
  }

  let returnToPath: string = "";

  try {
    const state = JSON.parse(
      Buffer.from(cookie.value, "base64").toString("utf-8")
    );
    if (state.nonce !== nonce) {
      throw new Error("Nonce does not match");
    }
    returnToPath = state.returnTo;
    cookies().delete("state");
  } catch (err) {
    return NextResponse.redirect(envVars.APP_URL + "/signin?error=state");
  }

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
    cookies().set(authAPI.buildCookie(token));
  } catch (err) {
    console.error(err);
  }

  return NextResponse.redirect(envVars.APP_URL + returnToPath);
}
