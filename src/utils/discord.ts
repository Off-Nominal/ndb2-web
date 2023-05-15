import { APIAuth } from "@/types/user";
import axios from "axios";
import {
  APIGuildMember,
  RESTGetAPIGuildMemberResult,
} from "discord-api-types/v10";

const DISCORD_API_BASE_URL = "https://discord.com/api";
const DISCORD_CDN_BASE_URL = "https://cdn.discordapp.com";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const GUILD_ID = process.env.OFFNOMDISCORD_GUILD_ID;

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const REDIRECT_URI = `${BASE_URL}/api/auth/oauth`;

const buildDiscordOAuthUrl = (options: {
  baseUrl: string;
  clientId: string;
  scope: string[];
  redirectUri: string;
}): string => {
  return `${options.baseUrl}/oauth2/authorize?response_type=code&client_id=${
    options.clientId
  }&scope=${encodeURIComponent(
    options.scope.join(" ")
  )}&redirect_uri=${encodeURIComponent(options.redirectUri)}&prompt=consent`;
};

export const buildAvatarUrl = (
  userId: string,
  hash: string | null | undefined,
  fallbackHash: string | null,
  discriminator: number
): string => {
  if (hash) {
    return `${DISCORD_CDN_BASE_URL}/guilds/${GUILD_ID}/users/${userId}/avatars/${hash}.png`;
  }

  if (fallbackHash) {
    return `${DISCORD_CDN_BASE_URL}/avatars/${userId}/${fallbackHash}.png`;
  }

  return `${DISCORD_CDN_BASE_URL}/embed/avatars/${discriminator % 5}.png`;
};

// Allowed Roles
const allowedRoles = new Set([
  process.env.ROLE_ID_HOST,
  process.env.ROLE_ID_MODS,
  process.env.ROLE_ID_MECO,
  process.env.ROLE_ID_WM,
  process.env.ROLE_ID_YT,
  process.env.ROLE_ID_ANOM,
  process.env.ROLE_ID_GUEST,
]);

export const hasCorrectRole = (roles: string[]): boolean => {
  for (const role of roles) {
    if (allowedRoles.has(role)) {
      return true;
    }
  }
  return false;
};

export class DiscordClient {
  private baseUrl: string;
  public oauthUrl: string;
  private scope: string[];

  constructor() {
    this.baseUrl = DISCORD_API_BASE_URL;
    this.scope = ["identify", "guilds"];
    this.oauthUrl = buildDiscordOAuthUrl({
      baseUrl: this.baseUrl,
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scope: this.scope,
    });
  }

  public authenticate(code: string) {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code,
      scope: this.scope.join(" "),
    }).toString();

    return axios
      .post<{
        access_token: string;
        token_type: string;
      }>(`${this.baseUrl}/oauth2/token`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((res) => res.data);
  }

  public identify(access_token: string) {
    return axios
      .get<RESTGetAPIGuildMemberResult>(
        `${this.baseUrl}/users/@me/guilds/${GUILD_ID}/member`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => res.data);
  }

  public authorize(member: APIGuildMember): {
    user: APIAuth.User | null;
    error: string | null;
  } {
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

  public fetchGuildMembers(access_token: string) {
    return axios
      .get<RESTGetAPIGuildMemberResult[]>(
        `${this.baseUrl}/guilds/${GUILD_ID}/members`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => res.data);
  }
}
