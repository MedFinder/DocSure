"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This is the client component that uses useSearchParams
export default function SuccessContent() {
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
    <div className="w-full max-w-2xl text-center sm:p-10">
      {/* Title */}
      <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
        Success!
      </p>
      <p>
        {successMessage}
      </p>
      
      {/* Phone Number Display */}
      {phoneNumber && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600 mb-1">Doctor's Phone Number:</p>
          <p className="font-medium">{phoneNumber}</p>
        </div>
      )}
      
      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-12">
        {phoneNumber ? (
          <a href={`tel:${phoneNumber}`}>
            <Button className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto">
              Call Doctor's Office
            </Button>
          </a>
        ) : (
          <Link href="#">
            <Button className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto">
              Call Doctor's Office
            </Button>
          </Link>
        )}
        <Link href="/">
          <Button className="bg-[#7DA1B7] text-white px-6 py-5 w-full sm:w-auto">
            Search Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
