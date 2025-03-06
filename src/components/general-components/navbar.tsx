//@ts-nocheck
"use client";
import { Menu, X, Search, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Detect the current page
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils"; // Helper for conditional classes
import { Combobox } from "../ui/combo-box";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { toast } from "sonner";
import axios from "axios";
import { ComboboxNav } from "../ui/combo-box-nav";
import { medicalSpecialtiesOptions } from "@/constants/store-constants";
import { Autocomplete } from "../../../components/ui/autocomplete";

const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const router = useRouter();
  const [selectedAvailability, setSelectedAvailability] = useState("anytime");
  const [timeOfAppointment, settimeOfAppointment] = useState("soonest");
  const [isnewPatient, setisnewPatient] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressLocation, setAddressLocation] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const inputRefs = useRef([]);
  const addressRefs = useRef([]);
  const [selectedOption, setSelectedOption] = useState("no");

  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });
  // console.log("::", savedAddress, savedSpecialty);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSpecialty = sessionStorage.getItem("selectedSpecialty");
      if (savedSpecialty) {
        setSpecialty(savedSpecialty);
        formik.setFieldValue("specialty", savedSpecialty);
      }

      const savedAddress = sessionStorage.getItem("selectedAddress");
      const savedAddressLocation = sessionStorage.getItem("selectedLocation");
      const AddressLocation = JSON.parse(savedAddressLocation);
      if (savedAddress) {
        setAddressLocation(savedAddress);
      }
      if (AddressLocation) {
        setSelectedLocation({
          lat: AddressLocation.lat,
          lng: AddressLocation.lng,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      // specialty: savedSpecialty || "",
      specialty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const updatedValues = { ...values };

      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        sessionStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );
        console.log();
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );

        sessionStorage.setItem("formDataNav", JSON.stringify(updatedValues));
        sessionStorage.setItem("statusDataNav", JSON.stringify(response.data));
        sessionStorage.setItem("lastSearchSource", "navbar"); // Track last search source

        window.dispatchEvent(new Event("storage"));

        console.log("Form Data:", values);
        console.log("API Response Data:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  // useEffect(() => {
  //   if (selectedOption === "no") {
  //     formik.setFieldValue("subscriberId", "");
  //     formik.setFieldValue("groupId", "");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedOption]);

  // const handleOnPlacesChanged = (index) => {
  //   if (inputRefs.current[index]) {
  //     const places = inputRefs.current[index].getPlaces();
  //     if (places.length > 0) {
  //       const place = places[0];
  //       const lat = place.geometry.location.lat();
  //       const lng = place.geometry.location.lng();
  //       setSelectedLocation({ lat, lng });
  //     }
  //   }
  // };
  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address; // Get address string

        setSelectedLocation({ lat, lng });
        setAddressLocation(formattedAddress); // Update input field state
        // sessionStorage.setItem("selectedAddress", formattedAddress); // Store in session
      }
    }
  };

  function handleCreateOptions() {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 w-full  border-gray-200 bg-white z-50">
      <div className="flex justify-between py-5 md:px-8 px-5 relative items-center">
        {/* Left Section: Logo & Search (only on Search Page) */}
        <div className="flex items-center gap-6 w-full">
          {/* Logo with onClick handler to navigate to home */}
          <span
            onClick={() => router.push("/")}
            className="text-[#FF6723] font-semibold text-xl whitespace-nowrap cursor-pointer"
          >
            Docsure
          </span>

          {/* Conditionally Show Search Bar on Search Page */}
          {pathname !== "/" && (
            <form
              onSubmit={formik.handleSubmit}
              className="hidden md:flex w-full max-w-[50rem] border border-gray-600 rounded-none shadow-sm"
            >
              <div className="flex flex-grow items-center w-full">
                {/* Specialty section */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center justify-center px-3">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <Autocomplete
                      id="specialty"
                      name="specialty"
                      className="w-full"
                      options={medicalSpecialtiesOptions}
                      placeholder="Medical specialty"
                      selected={specialty}
                      onChange={(value) => {
                        setSpecialty(value);
                        formik.setFieldValue("specialty", value);
                      }}
                      clearable={false}
                      navbar
                    />
                  </div>
                </div>

                {/* Location section */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center justify-center px-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    {isLoaded && (
                      <StandaloneSearchBox
                        onLoad={(ref) => (inputRefs.current[0] = ref)}
                        onPlacesChanged={() => handleOnPlacesChanged(0)}
                      >
                        <Input
                          type="text"
                          placeholder="Address, city, zip code"
                          className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
                          value={addressLocation || ""}
                          onChange={(e) => setAddressLocation(e.target.value)}
                          autoComplete="off"
                          aria-autocomplete="none"
                        />
                      </StandaloneSearchBox>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Button - Properly aligned */}
              <Button className="bg-[#FF6723] text-white rounded-none h-12 px-6 flex-shrink-0">
                <Search className="text-white w-5 h-5" />
              </Button>
            </form>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-md font-normal">
          <Link href="/contact-us" className="hover:text-gray-500">
            Help
          </Link>
        </div>

        {/* Mobile Hamburger */}
        {pathname == "/" && (
          <div className="md:hidden flex gap-8 items-center text-md font-normal">
            <Link href="/contact-us" className="hover:text-gray-500">
              Help
            </Link>
          </div>
        )}
        {pathname !== "/" && (
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu className="w-8 h-8 text-gray-700" />
          </button>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <span className="text-xl font-semibold text-[#FF6723]">DocSure</span>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* <nav className="flex flex-col gap-6 p-6 text-lg">
          <Link href="/" onClick={closeSidebar}>
            Browse
          </Link>
          <Link href="/contact-us" onClick={closeSidebar}>
            Help
          </Link>
          <Link href="" onClick={closeSidebar}>
            Log In
          </Link>
          <Button
            className="bg-[#0074BA] rounded-none w-full"
            onClick={closeSidebar}
          >
            Sign Up
          </Button>
        </nav> */}
      </div>

      {/* Overlay when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
