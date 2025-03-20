import type { Metadata } from "next";
import "./globals.css";
import { lexendFont } from "@/lib/font";
import { Toaster } from "sonner";
import Providers from "@/providers/permission-provider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@next/third-parties/google";
import GTMAnalytics from "./GTMAnalytics";
import { Suspense } from "react";
import Script from "next/script";
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
      <head>
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-108087795189"
        />
        <Script
          id="google-ads-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-108087795189');
            `,
          }}
        />
      </head>
      <GoogleTagManager gtmId="AW-10808779518" />
      <Providers>
        <body className={`${lexendFont.className} font-sans`}>
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {children}
          {/* </Suspense> */}
          <Analytics />
          <GTMAnalytics />
          <Toaster richColors={true} position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
