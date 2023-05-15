"use client";

import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import { ReactNode, createContext } from "react";

export const UserContext = createContext<User>({
  discordId: null,
});

type UserContextProviderProps = {
  children: ReactNode | ReactNode[];
};

export const UserContextProvider = (props: UserContextProviderProps) => {
  return (
    <UserContext.Provider value={useUser()}>
      {props.children}
    </UserContext.Provider>
  );
};
