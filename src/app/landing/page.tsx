"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useJsApiLoader } from "@react-google-maps/api";
import { track } from "@vercel/analytics";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { useLocation } from "@/hooks/useLocation";
import { useDoctorSearch } from "@/hooks/useDoctorSearch";
import { searchService } from "@/services/api";
import { moreDoctorTypes } from "@/constants/doctor-types";
import { Button } from "@/components/ui/button";
import { SearchFormValues } from "@/types";

// Import components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SearchForm from "./components/SearchForm";
import DoctorCardCarousel from "./components/DoctorCardCarousel";
import TestimonialCarousel from "./components/Testimonial";
import Places from "./components/Places";
import HealthConcerns from "./components/HealthConcerns";

// Schema for form validation
const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"),
});

// Utility function for smooth scrolling
const scrollToSection = (id: string, offset: number) => {
  const element = document.getElementById(id);
  if (element) {
    const topPosition = element.offsetTop - offset;
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
};

export default function LandingPage() {
  // Hooks
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledSpecialty, setPrefilledSpecialty] = useState("");
  const inputRefs = useRef<any[]>([]);
  const addressRefs = useRef<any[]>([]);
  
  // Custom hooks for location and doctor search
  const location = useLocation();
  const { doctors: popularDoctors, getPopularDoctors } = useDoctorSearch();

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Fetch popular doctors when location changes
  useEffect(() => {
    if (location.lat && location.lng && !location.isLoading) {
      getPopularDoctors(location.lat, location.lng);
    }
  }, [location.lat, location.lng, location.isLoading, getPopularDoctors]);

  // Handle doctor type selection
  const handleDoctorTypeClick = useCallback((value: string) => {
    formik.setFieldValue("specialty", value);
    setSelectedSpecialty(value);
  }, []);

  // Function to prefill doctor type and submit form
  const checkPrefillAvailability = useCallback((value: string) => {
    scrollToSection("home", 40);
    handleDoctorTypeClick('Primary Care Physician');
    formik.handleSubmit();
  }, [handleDoctorTypeClick, formik]);

  // Log request info to backend
  const logRequestInfo = useCallback(async () => {
    const savedAddress = sessionStorage.getItem("selectedAddress");
    const data = {
      doctor_speciality: formik.values.specialty,
      preferred_location: savedAddress,
    };
    
    return await searchService.logRequestInfo(data);
  }, [formik.values.specialty]);

  // Form handling with Formik
  const formik = useFormik<SearchFormValues>({
    initialValues: {
      specialty: prefilledSpecialty || "",
      insurance_carrier: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("Homepage_Search_Btn_Clicked");
      
      if (values.specialty === "unsure" || values.specialty === "Other") {
        router.push("/coming-soon");
        return;
      }
      
      setIsLoading(true);
      
      if (!location.lat || !location.lng) {
        toast.error("No location selected");
        setIsLoading(false);
        return;
      }
      
      try {
        const { lat, lng } = { lat: location.lat, lng: location.lng };
        sessionStorage.setItem("selectedSpecialty", values.specialty);
        sessionStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );

        // Log request info without awaiting
        const requestIdPromise = logRequestInfo();
        
        // Determine specialty value
        const speciality_value = values.specialty === 'Prescription / Refill' 
          ? 'Primary Care Physician' 
          : values.specialty;

        // Search for doctors
        const response = await searchService.searchPlaces(
          lat, lng, 20000, speciality_value
        );

        // Handle request_id when promise resolves
        requestIdPromise.then((request_id) => {
          if (request_id) {
            const updatedValues = { ...values, request_id };
            sessionStorage.setItem("formData", JSON.stringify(updatedValues));
          }
        });

        sessionStorage.setItem("statusData", JSON.stringify(response));
        sessionStorage.setItem("lastSearchSource", "home"); 
        router.push("/search");
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsLoading(false);
        toast.error("Error searching for doctors. Please try again.");
      }
    },
  });

  // Handle place selection in address input
  const handleOnPlacesChanged = useCallback((index: number) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        location.updateAddressFromPlace(place);
      }
    }
  }, [location]);

  // Handle prefill location
  const prefillLocation = useCallback((locationStr: string) => {
    scrollToSection("home", 40);
    location.setAddress(locationStr);
  }, [location]);

  // Memoize handler for address changes
  const handleOnAddressChanged = useCallback((index: number) => {
    if (addressRefs.current[index]) {
      const places = addressRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        const address = places[0];
        formik.setFieldValue("address", address?.formatted_address);
      }
    }
  }, [formik]);

  return (
    <div className="min-h-screen w-full bg-[#FCF8F1]">
      {/* Navigation */}
      <Navigation scrollToSection={scrollToSection} />

      {/* Main Content */}
      <main>
        <section
          id="home"
          className="md:h-screen h-auto md:pt-24 pt-36 flex flex-col items-center justify-center bg-[#FCF8F1] border-b relative"
        >
          <div className="flex flex-col text-center items-center w-full px-6 sm:px-20 lg:px-40 space-y-8 z-10">
            <div className="space-y-2">
              <h2 className="text-4xl text-[#E5573F]">
                Book top rated doctors near you
              </h2>
              <h2 className="text-xl font-normal">
                Let our AI call clinics and secure your appointment for free.
              </h2>
            </div>

            {/* Search Form Component */}
            <SearchForm 
              formik={formik}
              isLoaded={isLoaded}
              isLoading={isLoading}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              handleDoctorTypeClick={handleDoctorTypeClick}
              inputRefs={inputRefs}
              handleOnPlacesChanged={handleOnPlacesChanged}
              locationAddress={location.address}
              setLocationAddress={location.setAddress}
              isLocationValid={Boolean(location.lat && location.lng)}
            />

            <Link
              href="/coming-soon"
              className="text-[#E5573F] md:flex space-x-2 items-center hidden"
            >
              <p>Search for a doctor, hospital or medical group</p>
              <ArrowRight />
            </Link>
          </div>

          {/* Images positioned at the bottom edges */}
          <Image
            src="/doctor-doing-their-work-pediatrics-office 1.svg"
            alt="Doctor"
            width={180}
            height={180}
            className="absolute bottom-0 left-0 w-auto h-auto max-w-[180px] md:max-w-[180px] hidden md:block"
          />
          <Image
            src="/serious-mature-doctor-eyeglasses-sitting-table-typing-laptop-computer-office 1.svg"
            alt="Doctor"
            width={250}
            height={250}
            className="absolute bottom-0 right-0 w-auto h-auto max-w-[180px] md:max-w-[250px] hidden md:block"
          />
        </section>

        {/* About Section */}
        <section
          id="about"
          className="md:flex flex-col items-center justify-center gap-24 bg-white border-b md:py-12 px-0 md:px-64 hidden"
        >
          {/* ... existing code ... */}
        </section>

        {/* Mobile About Section */}
        <section
          id="about"
          className="flex-col items-center justify-center gap-24 bg-white border-b pt-6 md:px-64 md:hidden block text-left"
        >
          {/* ... existing code ... */}
        </section>

        {/* How It Works Section */}
        <section
          id="how_it_works"
          className="flex flex-col items-center justify-center gap-10 bg-[#0074BA] border-b md:py-16 py-8 px-0 md:px-44 text-white"
        >
          {/* ... existing code ... */}
        </section>

        {/* Doctors Section */}
        <section
          id="doctors"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 pb-16 px-0"
        >
          <h2 className="text-3xl md:px-44 mb-10 px-4 flex text-center">
            Top-rated doctors in your area
          </h2>
          <DoctorCardCarousel doctors={popularDoctors} checkPrefillAvailability={checkPrefillAvailability} />
        </section>

        {/* Testimonials Section */}
        <section className="flex flex-col items-center justify-center gap-10 bg-[#E5573F] text-white border-b md:pt-16 md:pb-16 py-8 px-0">
          <h2 className="text-3xl md:px-44 mb-4 text-white">
            Patients love Docsure
          </h2>
          <TestimonialCarousel />
        </section>

        {/* Specialties Section */}
        <section
          id="specialties"
          className="relative flex flex-col items-center justify-center gap-10 bg-white md:pt-16 md:pb-16 pt-8 px-0 pb-0"
        >
          <h2 className="text-3xl md:px-44 px-4 flex text-center">
            Browse specialties
          </h2>

          <div className="sm:flex-wrap sm:gap-3 flex flex-wrap justify-center gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 md:px-40">
            {moreDoctorTypes.map((value, index) => (
              <Button
                key={index}
                className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                  selectedSpecialty === value.value
                    ? "bg-slate-800 text-white"
                    : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800"
                }`}
                onClick={() => {
                  scrollToSection("home", 40);
                  handleDoctorTypeClick(value.value);
                }}
              >
                {value.label}
              </Button>
            ))}
          </div>

          <div className="absolute bottom-[-90px] left-0 w-full flex justify-start pl-12 pointer-events-none">
            <Image
              src="/OBJECTS.svg"
              alt="Decorative Star"
              width={200}
              height={200}
              className="hidden md:block"
            />
          </div>
        </section>

        {/* Spacer */}
        <section className="bg-white h-[88px]"></section>

        {/* Locations Section */}
        <section
          id="locations"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 px-0"
        >
          <h2 className="text-3xl md:px-44 mb-4">Browse Locations</h2>
          <Places
            PrefillLocation={prefillLocation}
            addressLocation={location.address}
          />

          {/* Insurance Plans */}
          <div
            id="insurance_plans"
            className="px-20 bg-white border-lg py-14 flex flex-col items-center justify-center"
          >
            {/* ... existing code ... */}
          </div>

          {/* Health Concerns */}
          <div>
            <HealthConcerns
              onClickAction={(speciality: string) => {
                scrollToSection("home", 40);
                handleDoctorTypeClick(speciality);
              }}
            />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
