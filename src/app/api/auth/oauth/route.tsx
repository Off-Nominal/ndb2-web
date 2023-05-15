import { RESTGetAPIGuildMemberResult } from "discord-api-types/v10";
import { buildAvatarUrl, buildDiscordUrl, hasCorrectRole } from "./helpers";
import axios from "axios";
import { add } from "date-fns";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { sign } from "@/utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const clientId = process.env.DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const guildId = process.env.OFFNOMDISCORD_GUILD_ID;

const redirectUri = `${BASE_URL}/api/auth/oauth`;

const scope = ["identify", "guilds"];

const OAUTH_URL = buildDiscordUrl({
  clientId,
  redirectUri,
  scope,
});

async function exchangeCode(code: string): Promise<{
  user: {
    name: string;
    avatarUrl: string;
    discordId: string;
  } | null;
  error: string | null;
}> {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code,
    scope: scope.join(" "),
  }).toString();

  const { data: auth } = await axios.post<{
    access_token: string;
    token_type: string;
  }>("https://discord.com/api/oauth2/token", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { data: member } = await axios.get<RESTGetAPIGuildMemberResult>(
    `https://discord.com/api/users/@me/guilds/${guildId}/member`,
    { headers: { Authorization: `Bearer ${auth.access_token}` } }
  );

  if (!hasCorrectRole(member.roles)) {
    return { user: null, error: "Incorrect role" };
  }

  if (!member.user) {
    return { user: null, error: "Missing Member information" };
  }

  const user = {
    name: member.nick || member.user?.username || "Unknown User",
    avatarUrl: buildAvatarUrl(
      member.user.id,
      member.avatar,
      member.user.avatar,
      Number(member.user.discriminator)
    ),
    discordId: member.user?.id,
  };

  return { user, error: null };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (typeof code !== "string") {
    return NextResponse.redirect(OAUTH_URL);
  }

  const { user, error } = await exchangeCode(code);

  if (error || !user) {
    console.log(error);
    return NextResponse.redirect(BASE_URL + "/signin?error=auth");
  }

  try {
    const token = await sign(user);

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

  return NextResponse.redirect(BASE_URL);
}
