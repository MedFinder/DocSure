import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function Success() {
  return (
    <>
      <Navbar />
      {/* Centered Full Page Form */}
      <div className="h-screen flex flex-col justify-center items-center px-6 sm:px-10 text-[#333333]">
        <div className="w-full max-w-2xl  text-center   sm:p-10 ">
          {/* Title */}
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            Success!
          </p>
          <p>
            Your appointment is set with{" "}
            <span className="font-semibold">Dr. Igor Kletsman, </span> MD on
            Monday, February 19, 2025, at 10:30 AM at Carewell Medical Clinic,
            New York
          </p>
          {/* Button */}
          <div className="flex justify-center space-x-4 mt-12">
            <Link href="/contact">
              <Button className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto ">
                Call Doctors Office
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-[#7DA1B7] text-white px-6 py-5 w-full sm:w-auto ">
                Search Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
