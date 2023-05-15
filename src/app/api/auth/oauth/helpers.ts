const guildId = process.env.OFFNOMDISCORD_GUILD_ID;

export const buildDiscordUrl = (options: {
  clientId: string;
  scope: string[];
  redirectUri: string;
}): string => {
  return `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${
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
    return `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/avatars/${hash}.png`;
  }

  if (fallbackHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${fallbackHash}.png`;
  }

  return `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`;
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
