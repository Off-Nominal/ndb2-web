"use client";

import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode, createContext } from "react";

export const UserContext = createContext<User>({
  discordId: null,
  // session: null,
});

type UserContextProviderProps = {
  children: ReactNode | ReactNode[];
};

export const UserContextProvider = (props: UserContextProviderProps) => {
  return (
    <SessionProvider>
      <UserContext.Provider value={useUser()}>
        {props.children}
      </UserContext.Provider>
    </SessionProvider>
  );
};
