"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SuccessContent from "./SuccessContent";

// This is the server component wrapper with Suspense
export default function Success() {
  return (
    <>
      <Navbar />
      {/* Centered Full Page Form */}
      <div className="h-screen flex flex-col justify-center items-center px-6 sm:px-10 text-[#333333]">
        {/* Wrap client component with Suspense boundary */}
        <Suspense
          fallback={
            <p className="text-center">Loading appointment details...</p>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </>
  );
}
