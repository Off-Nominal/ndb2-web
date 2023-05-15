"use client";

import { User } from "@/types/user";
import { useState } from "react";

export const useUser = (): User => {
  const [discordId, setDiscordId] = useState<null | string>(null);

  return { discordId };
};
