import { Toast } from "@/components/Toast";
import ToastProvider from "./contexts/toast";
import "./globals.css";

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
