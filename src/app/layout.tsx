import type { Metadata } from "next";
import "./globals.css";
import { lexendFont } from "@/lib/font";
import { Toaster } from "sonner";
import Providers from "@/providers/permission-provider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { StyledComponentsRegistry } from "@/lib/styled-components-registry";
import GTMAnalytics from "./GTMAnalytics";
import { Suspense } from "react";
import Script from "next/script";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

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
      <GoogleTagManager gtmId="G-1Q13KRXEPB" />
      <GoogleTagManager gtmId="GTM-TLWLQGKV" />
      <GoogleTagManager gtmId="GTM-TK9TF844" />
      <Providers>
        <body className={lexendFont.className}>
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          {/* </Suspense> */}
          <Analytics />
          <ExitIntentPopup />
          {/* <GTMAnalytics /> */}
          <Toaster richColors={true} position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
{
  /*GTM-TK9TF844 */
}
