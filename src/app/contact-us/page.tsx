import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
            Contact Us
          </p>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Patient name</Label>
              <Input className="rounded-none"></Input>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input className="rounded-none"></Input>
            </div>
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea className="rounded-none"></Textarea>
            </div>
          </div>

          {/* Additional Info */}
          <span className="text-sm text-gray-600 block pt-2 ">
            We will respond within 24 hours.
          </span>

          {/* Button */}
          <div className="flex justify-center mt-12">
            <Link href="/transcript">
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
