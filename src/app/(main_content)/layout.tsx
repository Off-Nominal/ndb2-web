import authAPI from "@/utils/auth";
import { Navigation } from "./Navigation";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  return (
    <div className="flex w-full flex-col content-center p-4 align-middle sm:px-6 sm:py-4">
      <header className="mb-10 mt-4 flex flex-col gap-4 md:mb-8 lg:flex-row lg:justify-between">
        <Link href="/">
          <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
            NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
          </h1>
        </Link>
        <Navigation />
      </header>
      <main>{children}</main>
    </div>
  );
}
