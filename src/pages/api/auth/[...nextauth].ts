import axios from "axios";
import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { APIRole, APIGuildMember } from "discord-api-types/v10";

const clientId = process.env.DISCORD_CLIENT_ID || "";
const clientSecret = process.env.DISCORD_CLIENT_SECRET || "";
const guildId = process.env.OFFNOMDISCORD_GUILD_ID;

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

const hasCorrectRole = (roles: string[]): boolean => {
  for (const role of roles) {
    if (allowedRoles.has(role)) {
      return true;
    }
  }
  return false;
};

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId,
      clientSecret,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      let hasAccess = false;

      try {
        const res = await axios.get<APIGuildMember>(
          `https://discordapp.com/api/users/@me/guilds/${guildId}/member`,
          {
            headers: {
              Authorization: "Bearer " + account?.access_token,
              "Content-Type": "application/json",
            },
          }
        );

        hasAccess = hasCorrectRole(res.data.roles);
      } catch (err) {
        console.error(err);
      }

      return hasAccess;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return Promise.resolve(session);
    },
  },
});
