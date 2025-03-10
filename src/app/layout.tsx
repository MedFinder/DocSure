import type { Metadata } from "next";
import "./globals.css";
import { lexendFont } from "@/lib/font";
import { Toaster } from "sonner";
import Providers from "@/providers/permission-provider";
import { Analytics } from '@vercel/analytics/next';
export const metadata: Metadata = {
  title: "Docsure | Book top rated doctors near me",
  description: "Docsure | Book top rated doctors near me",
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
          <Analytics />
          <Toaster richColors={true} position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
