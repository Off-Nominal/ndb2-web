import { Toast } from "@/components/Toast";
import ToastProvider from "./contexts/toast";
import "./globals.css";
import { Metadata } from "next";

const title = "Nostradambot2";
const description =
  "A fun predictions betting game for the Off-Nominal Discord.";

export const metadata: Metadata = {
  title: {
    template: "%s | NDB2",
    default: title,
  },
  applicationName: title,
  creator: "Jake Robins",
  publisher: "Off-Nominal Studios",
  description,
  authors: [
    { name: "Jake Robins", url: "https://twitter.com/JakeOnOrbit" },
    { name: "David Halpin" },
    { name: "Ben Hallert", url: "https://deltayeet.net" },
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "https://ndb2.offnom.com",
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    site: "@offnom",
    creator: "@JakeOnOrbit",
  },
  manifest: "/site.webmanifest",
  themeColor: "#020617",
  icons: {
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
    },
  },
  other: {
    "msapplication-Tilecolor": "#2b5797",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"h-full"}>
      <body className="flex h-full w-full justify-center">
        <ToastProvider>
          <div className="sm:w-[480px] md:w-[768px] lg:w-[976px] xl:w-[1200px]">
            {children}
          </div>
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
