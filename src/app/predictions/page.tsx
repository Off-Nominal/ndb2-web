import authAPI from "@/utils/auth";
import { redirect } from "next/navigation";
import { Navigation } from "../components/Navigation";

export default async function Predictions() {
  const payload = await authAPI.verify();

  if (!payload) {
    return redirect("/signin");
  }

  return (
    <div className="flex h-full w-full flex-col content-center p-8 align-middle">
      <nav className="mb-8 mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
          NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
        </h1>
        <Navigation />
      </nav>
      <main></main>
    </div>
  );
}
