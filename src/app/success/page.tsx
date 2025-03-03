"use client";

import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

export default function Success() {
const searchParams = useSearchParams();
const [successMessage, setSuccessMessage] = useState<string>("Your appointment was booked successfully");
const [phoneNumber, setPhoneNumber] = useState<string>("");
useEffect(() => {
// Get the parameters from URL
const message = searchParams.get("success_message");
const phone = searchParams.get("phone_number");

if (message) {
    setSuccessMessage(decodeURIComponent(message));
}

if (phone) {
    setPhoneNumber(decodeURIComponent(phone));
}
}, [searchParams]);
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <Navbar />
      {/* Centered Full Page Form */}
      <div className="h-screen flex flex-col justify-center items-center px-6 sm:px-10 text-[#333333]">
        <div className="w-full max-w-2xl  text-center   sm:p-10 ">
          {/* Title */}
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            Success!
          </p>
          <p>
            {successMessage}
          </p>
          {/* Button */}
          <div className="flex justify-center space-x-4 mt-12">
            <Link href="#">
              <Button className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto ">
                Call Doctors Office
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-[#7DA1B7] text-white px-6 py-5 w-full sm:w-auto ">
                Search Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>

    </>
  );
}
