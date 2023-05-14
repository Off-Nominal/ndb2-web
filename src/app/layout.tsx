import { UserContextProvider } from "@/contexts/userContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </UserContextProvider>
  );
}
