import type { Metadata } from "next";
import "./globals.css";
import { lexendFont } from "@/lib/font";
import { Toaster } from "sonner";
import Providers from "@/providers/permission-provider";
export const metadata: Metadata = {
  title: "Docsure",
  description: "Docsure App",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${lexendFont.className} font-sans`}>
          {children}
          <Toaster richColors={true} position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
