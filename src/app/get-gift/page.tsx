"use client";

import React from "react";
import { ArrowLeft, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FooterSection from "../landing/components/FooterSection";

export default function GetGift() {
  return (
    <div className="min-h-screen bg-[#FCF8F1]">
      {/* Navigation bar */}
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50 text-sm">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/web-new-logo.svg"
              alt="DocSure Logo"
              width={0}
              height={0}
              className="w-28 h-auto md:flex cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
          {/* <Link href="/contact-us">
            <Button variant="ghost" className="flex items-center gap-2">
              Help
            </Button>
          </Link> */}
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
          {/* Header section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="mb-4">
              <Gift className="w-16 h-16 text-[#E5573F]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#E5573F]">
              Limited time offer: Get $100!
            </h1>
          </div>

          {/* Bullet list section */}
          <div className="space-y-8 mb-10">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0074BA] flex items-center justify-center text-white">
                1
              </div>
              <div>
                <p className="text-lg font-medium">
                  Get a $20 Amazon Gift Card. <Link href="/" className="text-[#0074BA] hover:underline">Book your doctor appointment</Link> and complete a <a href="https://form.typeform.com/to/VPJ0OhpE" target="_blank" rel="noopener noreferrer" className="text-[#0074BA] hover:underline">quick feedback survey</a>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0074BA] flex items-center justify-center text-white">
                2
              </div>
              <div>
                <p className="text-lg font-medium">
                  Plus, earn $20 for every friend you refer who books an appointment — up to $80 total. Your email address is your referral code. Share it with others!
                </p>
              </div>
            </div>
          </div>

          {/* Note at bottom */}
          <div className="text-center text-sm text-gray-500 mt-8 border-t pt-6">
            <p>Gift cards are sent within 3 business days of completion.</p>
          </div>

          {/* Get started button */}
          <div className="mt-10 flex justify-center">
            <Link href="/landing">
              <Button className="bg-[#E5573F] text-white px-8 py-2 rounded-md hover:bg-[#d04835]">
                Book an Appointment
              </Button>
            </Link>
          </div>
        </div>
          <FooterSection />
      </main>
    </div>
  );
}