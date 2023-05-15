import { UserContextProvider } from "@/contexts/userContext";
import "./globals.css";
import { Navigation } from "./components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"h-full"}>
      <body className="flex h-full w-full justify-center">
        <div className="sm:w-[480px] md:w-[768px] lg:w-[976px] xl:w-[1200px]">
          <UserContextProvider>
            <div className="flex h-full w-full flex-col content-center p-8 align-middle">
              <nav className="mb-8 mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="h-min text-center text-3xl sm:text-4xl md:text-5xl">
                  NOSTRADAMBOT<span className={"text-moonstone-blue"}>2</span>
                </h1>
                <Navigation />
              </nav>
              <main>{children}</main>
            </div>
          </UserContextProvider>
        </div>
      </body>
    </html>
  );
}
