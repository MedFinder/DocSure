"use client";

import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

// External API URL - replace with your actual endpoint
const CONTACT_API_URL = "https://callai-backend-243277014955.us-central1.run.app/api/contact-us"; 

// Define interfaces for type safety
interface FormData {
  patient_name: string;
  email: string;
  message: string;
}

interface FormErrors {
  patient_name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    patient_name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Using external API endpoint instead of Next.js API route
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.patient_name,
          email: formData.email,
          message: formData.message,
          // Add any additional fields required by your API
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      toast.success("Message Sent Successfully");
      // Reset form after successful submission
      setFormData({
        patient_name: "",
        email: "",
        message: "",
      });
      
      // Redirect to home page after successful submission
      router.push("/");
      
    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast.error("Failed to send message")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Centered Full Page Form */}
      <div className="h-screen flex flex-col justify-center items-center px-6 sm:px-10">
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg">
          {/* Title */}
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            Contact Us
          </p>

          {/* Form Fields */}
          <form onSubmit={onSubmitForm} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient name</Label>
              <Input 
                id="patient_name" 
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className={`rounded-none ${errors.patient_name ? "border-red-500" : ""}`}
              />
              {errors.patient_name && (
                <p className="text-red-500 text-sm mt-1">{errors.patient_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`rounded-none ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`rounded-none ${errors.message ? "border-red-500" : ""}`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Additional Info */}
            <span className="text-sm text-gray-600 block pt-2">
              We will respond within 24 hours.
            </span>

            {/* Button */}
            <div className="flex justify-center mt-12">
              <Button 
                type="submit"
                className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Continue"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
