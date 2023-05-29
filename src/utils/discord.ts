import { APIAuth } from "@/types/user";
import {
  APIGuildMember,
  RESTGetAPIGuildMemberResult,
} from "discord-api-types/v10";
import { getAppUrl } from "./misc";

export type ShortDiscordGuildMember = {
  name: string;
  avatarUrl: string;
  discordId: string;
};

const DISCORD_API_BASE_URL = "https://discord.com/api";
const DISCORD_CDN_BASE_URL = "https://cdn.discordapp.com";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const CLIENT_BOT_ID = process.env.DISCORD_CLIENT_BOT_TOKEN || "";
const GUILD_ID = process.env.OFFNOMDISCORD_GUILD_ID;

const APP_URL = getAppUrl();
const REDIRECT_URI = `${APP_URL}/api/auth/oauth`;

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

const baseUrl = DISCORD_API_BASE_URL;
const scope = ["identify", "guilds", "guilds.members.read"];

const authenticate = (
  code: string
): Promise<{
  access_token: string;
  token_type: string;
}> => {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    code,
    scope: scope.join(" "),
  }).toString();

  return fetch(`${baseUrl}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).then((res) => res.json());
};

const identify = (
  access_token: string
): Promise<RESTGetAPIGuildMemberResult> => {
  return fetch(`${baseUrl}/users/@me/guilds/${GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${access_token}` },
  }).then((res) => res.json());
};

const authorize = (
  member: APIGuildMember
): {
  user: APIAuth.User | null;
  error: string | null;
} => {
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
};

const getGuildMembers = () => {
  return fetch(`${baseUrl}/guilds/${GUILD_ID}/members?limit=1000`, {
    headers: { Authorization: `Bot ${CLIENT_BOT_ID}` },
    next: {
      revalidate: 86400,
    },
  }).then((res) => res.json());
};

const getGuildMemberByDiscordId = (discordId: string) => {
  return fetch(`${baseUrl}/guilds/${GUILD_ID}/members/${discordId}`, {
    headers: { Authorization: `Bot ${CLIENT_BOT_ID}` },
    next: {
      revalidate: 86400,
    },
  }).then((res) => res.json());
};

export class GuildMemberManager {
  private members: Record<string, ShortDiscordGuildMember> = {};

  constructor() {}

  public initialize = (): Promise<void> => {
    return getGuildMembers().then((members) => {
      for (const member of members) {
        this.members[member.user.id] = {
          name: member.nick || member.user?.username || "Unknown User",
          avatarUrl: buildAvatarUrl(
            member.user?.id,
            member.avatar,
            member.user?.avatar,
            Number(member.user?.discriminator)
          ),
          discordId: member.user?.id,
        };
      }
    });
  };

  public getMemberByDiscordId = (
    discordId: string
  ): Promise<ShortDiscordGuildMember> => {
    if (this.members[discordId]) {
      return Promise.resolve(this.members[discordId]);
    } else {
      return getGuildMemberByDiscordId(discordId).then((member) => {
        this.members[discordId] = {
          name: member.nick || member.user?.username || "Unknown User",
          avatarUrl: buildAvatarUrl(
            member.user?.id,
            member.avatar,
            member.user?.avatar,
            Number(member.user?.discriminator)
          ),
          discordId: member.user?.id,
        };
        return this.members[discordId];
      });
    }
  };
}

const discordAPI = {
  authenticate,
  identify,
  authorize,
  GuildMemberManager,
  oAuthUrl: buildDiscordOAuthUrl({
    baseUrl,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scope,
  }),
};

export default discordAPI;
