import type { Metadata } from "next";
import "./globals.css";
import { lexendFont } from "@/lib/font";

export const metadata: Metadata = {
  title: "DocSure",
  description: "DocSure App",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexendFont.className} font-sans`}>{children}</body>
    </html>
  );
}
