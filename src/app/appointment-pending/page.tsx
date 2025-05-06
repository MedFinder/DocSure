"use client";

import React from "react";
import NavbarSection from "@/components/general-components/navbar-section";
import FooterSection from "@/app/landing/components/FooterSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function AppointmentPendingPage() {
  return (
    <>
      <NavbarSection />
      <div className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10">
        <div className="w-full max-w-2xl p-6 sm:p-10 rounded-lg text-center">
          <h1 className="text-2xl sm:text-4xl mt-10 font-semibold text-[#333333]">
            Your appointment is pending
          </h1>
          <p className="text-gray-600 mt-4 mb-8">
            Your Doctor has 1 hour to confirm. You will receive an SMS and email with appointment details.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <a 
              href="https://form.typeform.com/to/VPJ0OhpE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button 
                className="w-full bg-[#E5573F] text-white hover:bg-[#d64c36] md:px-4"
                onClick={() => track("Feedback_Form_Clicked")}
              >
                Feedback form - Get $20
              </Button>
            </a>
            <Link href="/get-gift" className="w-full">
              <Button 
                className="w-full bg-[#0074BA] text-white hover:bg-[#00619e] md:px-4"
                onClick={() => track("Refer_Friends_Clicked")}
              >
                Refer friends - Get $80
              </Button>
            </Link>
            <Link href="/contact-us" className="w-full">
              <Button 
                className="w-full bg-gray-200 text-[#333333] hover:bg-gray-300 md:px-4"
                onClick={() => track("Contact_Us_Clicked")}
              >
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="flex md:mt-12 my-6 w-full">
            <div className="w-full flex flex-col space-y-2 mb-3">
              <ul className="list-disc pl-4 space-y-1">
                <li className="text-xs text-gray-600 text-left">
                  We will contact you as soon as your doctor confirms your appointment.
                </li>
                <li className="text-xs text-gray-600 text-left">
                  If you don't receive a confirmation within 1 hour, please check your spam folder or contact us.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/" className="text-[#0074BA] underline hover:text-[#00619e]" onClick={() => track("Back_To_Home_Clicked")}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}