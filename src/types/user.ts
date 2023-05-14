import { Session } from "next-auth";

export type User = {
  discordId: string | null;
  // session: Session | null;
};
