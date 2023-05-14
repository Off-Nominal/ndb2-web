"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <main>
      <h1>
        NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
      </h1>
      {session ? (
        <>
          <p>Welcome to Nostradambot 2 Web Portal</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </main>
  );
}
