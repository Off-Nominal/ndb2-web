import { Card } from "@/components/Card";
import authAPI from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const payload = await authAPI.verify();

  if (payload) {
    redirect("/");
  }

  return (
    <div className="grid h-full place-content-center">
      <Card title="Login with Discord" className="m-4 h-min max-w-xl">
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
          <p className="my-16">
            Nostradambot 2 requires paid membership to the Off-Nominal Discord.
            Authenticate here with your Discord account to gain access.
          </p>
          <Link
            prefetch={false}
            className={
              "block rounded-2xl bg-discord-purple px-8 py-4 text-center text-xl"
            }
            href="/api/auth/oauth"
          >
            Sign In through Discord
          </Link>
        </div>
      </Card>
    </div>
  );
}
