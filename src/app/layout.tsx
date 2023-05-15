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
          <UserContextProvider>{children}</UserContextProvider>
        </div>
      </body>
    </html>
  );
}
