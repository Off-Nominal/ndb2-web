import { Card } from "@/components/Card";
import authAPI from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInMessage } from "./SignInMessage";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const payload = await authAPI.verify();

  // User already logged in, redirect to home page
  if (payload) {
    redirect("/");
  }

  let returnToPath = searchParams.returnTo;

  if (typeof returnToPath !== "string") {
    returnToPath = "/";
  }

  return (
    <div className="grid h-full place-content-center">
      <Card
        header={
          <h2 className="text-center text-2xl uppercase text-white sm:text-3xl">
            Login with Discord
          </h2>
        }
        className="m-4 h-min max-w-xl"
      >
        <div className="p-8">
          <div className="my-4 flex justify-center">
            <Image
              src="/offnominal.svg"
              width={150}
              height={150}
              alt="Off-Nominal Podcast Logo"
              priority
            />
          </div>
          <SignInMessage />
          <Link
            prefetch={false}
            className={
              "block rounded-2xl bg-discord-purple px-8 py-4 text-center text-xl"
            }
            href={
              "/api/auth/oauth?returnTo=" +
              encodeURIComponent(returnToPath || "/")
            }
          >
            Sign In through Discord
          </Link>
        </div>
      </Card>
    </div>
  );
}
