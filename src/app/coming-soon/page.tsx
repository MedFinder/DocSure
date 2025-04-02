"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useEffect } from "react";

export default function ComingSoonPage() {
  useEffect(() => {
    track("ComingSoonPageScreen_viewed");
  }
  , []);
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
          Coming Soon!
        </p>
        <p className="text-gray-500 mt-2">
          This feature is under development and will be available soon. Please modify your selection and try again
        </p>
        <Link href="/landing">
          <Button className="bg-[#7DA1B7] text-white px-6 py-5 mt-8 w-full sm:w-auto">
            Go Back to Home
          </Button>
        </Link>
      </div>
    </>
  );
}
