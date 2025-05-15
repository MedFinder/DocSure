//@ts-nocheck
"use client";
import { Menu, X, Search, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
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
import { track } from "@vercel/analytics";

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
    googleMapsApiKey: "AIzaSyDCPbnPb43gQZDPT5dpq10a3dOP3EMHw-0",
    libraries: ["places"],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parsedFormData = JSON.parse(localStorage.getItem("formData"));
      if (parsedFormData?.specialty) {
        setSpecialty(parsedFormData?.specialty);
        formik.setFieldValue("specialty", parsedFormData?.specialty);
      }

      const savedAddress = parsedFormData?.address;
      const savedAddressLocation = localStorage.getItem("selectedLocation");
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
      specialty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("Navbar_Search_Btn_Clicked");
      if (!specialty) {
        toast.error("Please select a specialty");
        return;
      }

      if (!selectedLocation) {
        toast.error("Please select a location");
        return;
      }

      setisLoading(true);

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        const speciality_value =
          formik.values.specialty === "Prescription / Refill"
            ? "Primary Care Physician"
            : formik.values.specialty;
        const data = {
          location: `${lat},${lng}`,
          radius: 20000,
          keyword: speciality_value,
        };

        localStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );

        const response = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
          data
        );

        const updatedValues = { specialty: values.specialty };
        localStorage.setItem("formDataNav", JSON.stringify(updatedValues));
        localStorage.setItem("statusData", JSON.stringify(response.data));
        localStorage.setItem("lastSearchSource", "navbar"); // Track last search source

        window.dispatchEvent(new Event("storage"));

        router.push("/search-doctor");
      } catch (error) {
        console.error("Error searching:", error);
        toast.error("An error occurred during search");
      } finally {
        setisLoading(false);
      }
    },
  });
  const updateAddressInStorage = (value) => {
    // Update address in formData
    const existingFormData = localStorage.getItem("formData");
    let formDataObj = existingFormData ? JSON.parse(existingFormData) : {};
    formDataObj.address = value;
    localStorage.setItem("formData", JSON.stringify(formDataObj));
  };
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
        updateAddressInStorage(formattedAddress); // Update address in local storage
        localStorage.setItem(
          "selectedLocation",
          JSON.stringify({ lat, lng })
        );
      }
    }
  };

  function handleCreateOptions() {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full  border-gray-200 bg-white z-50">
      <div className="flex justify-between py-5 md:px-8 px-5 relative md:border-none   border border-b-2 items-center">
        {pathname == "/" && (
          <div
            onClick={() => router.push("/")}
            className="md:hidden flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/Logo.png"
              alt="Docsure Logo"
              width={30}
              height={30}
              className="w-auto h-auto"
            />

            <span className="text-[#FF6723] font-semibold text-xl whitespace-nowrap">
              Docsure
            </span>
          </div>
        )}
        <div className=" flex gap-4 w-full">
          <div
            onClick={() => router.push("/")}
            className="hidden md:flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/Logo.png"
              alt="Docsure Logo"
              width={30}
              height={30}
              className="w-auto h-auto"
            />

            <span className="text-[#FF6723] font-semibold text-xl whitespace-nowrap">
              Docsure
            </span>
          </div>
          {pathname !== "/" && (
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col md:flex-row w-full max-w-[50rem] border border-gray-600 rounded-none shadow-sm"
            >
              <div className="flex flex-col md:flex-row w-full relative">
                <div className="flex flex-col md:flex-row flex-grow w-full">
                  <div className="flex items-center flex-1 border-b md:border-b-0 border-gray-300">
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

                <Button className="bg-[#FF6723] text-white rounded-none px-6 md:h-12 h-full md:w-auto absolute md:static right-0 top-0 bottom-0">
                  <Search className="text-white w-5 h-5" />
                </Button>
              </div>
            </form>
          )}
        </div>
        {pathname !== "/" && (
          <button onClick={toggleSidebar} className="md:hidden ml-4">
            <Menu className="w-8 h-8 text-gray-700" />
          </button>
        )}

        <div className="hidden md:flex gap-8 items-center text-md font-normal">
          <Link
            onClick={() => track("Help_Btn_Clicked")}
            href="/contact-us"
            className="hover:text-gray-500"
          >
            Help
          </Link>
        </div>
        {pathname == "/" && (
          <div className="md:hidden flex gap-8 items-center text-md font-normal ">
            <Link href="/contact-us" className="hover:text-gray-500">
              Help
            </Link>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 md:hidden flex">
          <div
            className={cn(
              "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/Logo.png"
                  alt="Docsure Logo"
                  width={24}
                  height={24}
                  className="w-auto h-auto"
                />
                <span className="text-xl font-semibold text-[#FF6723]">
                  DocSure
                </span>
              </Link>
              <button onClick={closeSidebar}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 p-6 text-lg">
              <Link
                href="/contact-us"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/contact-us");
                }}
                className="hover:text-gray-500"
              >
                Help
              </Link>
            </nav>
          </div>

          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={closeSidebar}
          />
        </div>
      )}
    </div>
  );
}