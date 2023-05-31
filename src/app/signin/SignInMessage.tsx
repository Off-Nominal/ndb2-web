"use client";

import { useSearchParams } from "next/navigation";

export const SignInMessage = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  let message =
    "Sign in to Nostradambot2 using your Discord Account. Nostradambot2 Users must be members of the Off-Nominal Discord with a paid account.";

  if (error === "auth") {
    message =
      "We were unable to authenticate your Discord account. Please make sure you're using an active account and your password is correct.";
  } else if (error === "identify") {
    message =
      "We were unable to find you on the Off-Nominal Discord. Please make sure you're a member of our server.";
  } else if (error === "authorize") {
    message =
      "We weren't able to verify that you have a paid role in the Off-Nominal Discord.";
  }

  return <p className="my-16">{message}</p>;
};
