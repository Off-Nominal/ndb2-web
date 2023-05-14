"use client";

import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const useUser = (): User => {
  const [discordId, setDiscordId] = useState<null | string>(null);

  return { discordId };
};
