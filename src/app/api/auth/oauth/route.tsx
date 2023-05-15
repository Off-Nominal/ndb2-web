import { add } from "date-fns";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthClient } from "@/utils/auth";
import { DiscordClient } from "@/utils/discord";
import { getAppUrl } from "@/utils/misc";

const APP_URL = getAppUrl();

const discordClient = new DiscordClient();
const authClient = new AuthClient();

async function exchangeCode(code: string): Promise<{
  user: {
    name: string;
    avatarUrl: string;
    discordId: string;
  } | null;
  error: string | null;
}> {
  const { access_token } = await discordClient.authenticate(code);
  const member = await discordClient.identify(access_token);
  const user = await discordClient.authorize(member);

  return user;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (typeof code !== "string") {
    return NextResponse.redirect(discordClient.oauthUrl);
  }

  const { user, error } = await exchangeCode(code);

  if (error || !user) {
    console.log(error);
    return NextResponse.redirect(APP_URL + "/signin?error=auth");
  }

  try {
    const token = await authClient.sign(user);

    // NEXT JS has a bug where it doesn't recognize the typing for the set method inside a server route
    // This comment written while on Next.JS v 13.4.2
    // @ts-ignore
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      expires: add(new Date(), { days: 1 }),
      sameSite: "lax",
    });
  } catch (err) {
    console.error(err);
  }

  return NextResponse.redirect(APP_URL);
}
