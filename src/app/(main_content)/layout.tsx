import authAPI from "@/utils/auth";
import { Navigation } from "./Navigation";
import { redirect } from "next/navigation";
import { Toast } from "./Toast";
import ToastProvider from "../contexts/toast";

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
    <div className="flex h-full w-full flex-col content-center p-2 align-middle sm:px-6 sm:py-4">
      <ToastProvider>
        <header className="mb-10 mt-4 flex flex-col gap-4 md:mb-8 lg:flex-row lg:justify-between">
          <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
            NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
          </h1>
          <Navigation />
        </header>
        <main>{children}</main>

        <Toast />
      </ToastProvider>
    </div>
  );
}
