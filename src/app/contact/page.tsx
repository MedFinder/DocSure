import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function Contact() {
  return (
    <>
      <Navbar />
      {/* Centered Full Page Form */}
      <div className="h-screen flex flex-col justify-center items-center px-6 sm:px-10">
        <div className="w-full max-w-lg   p-6 sm:p-10 rounded-lg">
          {/* Title */}
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            One Last Step
          </p>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Patient name</Label>
              <Input className="rounded-none"></Input>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input className="rounded-none"></Input>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input className="rounded-none"></Input>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input className="rounded-none"></Input>
            </div>
          </div>

          {/* Additional Info */}
          <span className="text-sm text-gray-600 block pt-2 ">
            Appointment details will be sent to this email.
          </span>

          {/* Button */}
          <div className="flex justify-center mt-12">
            <Link href="/contact">
              <Button className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto ">
                Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
