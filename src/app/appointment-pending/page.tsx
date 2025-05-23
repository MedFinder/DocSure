"use client";

import React, { Suspense, useState } from "react";
import NavbarSection from "@/components/general-components/navbar-section";
import FooterSection from "@/app/landing/components/FooterSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useSearchParams } from "next/navigation";


  function AppointmentPage() {
    const APPOINTMENT_API_URL =
  "https://callai-backend-243277014955.us-central1.run.app/api/update-auto-calling";
    const [autoBook, setAutoBook] = useState(true);
    const searchParams = useSearchParams();
    const message = searchParams?.get("message");
  
    const updateAutoCalling = async () => {
      setAutoBook(!autoBook);
      // Add any additional logic for handling the auto booking state
      // console.log("Auto booking set to:", !autoBook);
      try {
        const formData = JSON.parse(localStorage.getItem("formData") || "{}");
        // Using formData API endpoint instead of Next.js API route
        const response = await fetch(APPOINTMENT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: formData?.request_id,
            auto_calling: !autoBook,
            // Add any additional fields required by your API
          }),
        });
  
        const data = await response.json();
        console.log("Response data:", data);
  
      } catch (error: unknown) {
        console.log("Submission error:", error);
      } finally {
       // setIsSubmitting(false);
      }
    };
    return (
      <>
      <NavbarSection />
        <div className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-10">
          <div className="w-full max-w-2xl p-6 sm:p-10 rounded-lg text-center">
            <h1 className="text-2xl sm:text-4xl mt-10 font-semibold text-[#333333]">
              Your appointment is pending
            </h1>
            <p className="text-gray-600 mt-4 mb-8">
              {message ?? "Your Doctor has 1 hour to confirm. You will receive an SMS and email with appointment details." }
            </p>
  
            <div className="flex items-center mb-6 justify-center">
              <input
                type="checkbox"
                id="autoBookCheckbox"
                checked={autoBook}
                onChange={updateAutoCalling}
                className="w-4 h-4 text-[#0074BA] bg-gray-100 border-gray-300 rounded focus:ring-[#0074BA]"
              />
              <label
                htmlFor="autoBookCheckbox"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Auto book another top rated doctor around me if this doctor is
                unavailable
              </label>
            </div>
  
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
  
            <div className="mt-8">
              <Link
                href="/"
                className="text-[#0074BA] underline hover:text-[#00619e]"
                onClick={() => track("Back_To_Home_Clicked")}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <FooterSection />
      </>
    )
  }
export default function AppointmentPendingPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <AppointmentPage />
    </Suspense>
  );
}