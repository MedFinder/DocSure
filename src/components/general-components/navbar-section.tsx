//@ts-nocheck
"use client";
import { Menu, X, Search, MapPin, BookText } from "lucide-react";
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
import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { track } from "@vercel/analytics";
import QuickDetailsModal from "@/app/landing/components/QuickDetailsModal";

const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

interface NavbarSectionProps {
  updatePreferences?: boolean; // Flag to show "Update Preferences" text
  openModal?: boolean; // Flag to open QuickDetailsModal
  setispreferencesUpdated?: (value: boolean) => void; // Callback to set preferences updated state
  setIsPreferencesReinitialized?: (value: boolean) => void; // Callback to set preferences reinitialized state
}

export default function NavbarSection({
  updatePreferences = false,
  confirmUpdatePreferences,
  openModal = false,
  setIsPreferencesUpdated,
  setIsPreferencesReinitialized,
}: NavbarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(openModal);
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
  const [insurer, setInsurer] = useState("");
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSpecialty = localStorage.getItem("selectedSpecialty");
      const selectedInsurer = localStorage.getItem("selectedInsurer");
      const formData = localStorage.getItem("formData");
      if (formData) {
        const parsedFormData = JSON.parse(formData);
        if (parsedFormData?.insurer) {
          setInsurer(parsedFormData?.insurer);
          formik.setFieldValue("insurance_carrier", parsedFormData?.insurer); // ✅ correct field
        }
      }
      if (savedSpecialty) {
        setSpecialty(savedSpecialty);
        formik.setFieldValue("specialty", savedSpecialty);
      }
      if(selectedInsurer){
        formik.setFieldValue("insurance_carrier", selectedInsurer);
      }
      const savedAddress = localStorage.getItem("selectedAddress");
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
  }, [openModal, isModalOpen]); // Added openModal and isModalOpen to dependency array

  const formik = useFormik({
    initialValues: {
      specialty: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      track("Navbar_Search_Btn_Clicked");
      const updatedValues = { ...values };

      // If updatePreferences is true, open the modal instead of searching
      if (updatePreferences) {
        setIsPreferencesUpdated(false);
        setIsPreferencesReinitialized(false);
        setIsModalOpen(true);
        return;
      }

      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        localStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );
        const data = {
          location: `${lat},${lng}`,
          radius: 20000,
          keyword: formik.values.specialty,
        };
        const response = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
          data
        );

        localStorage.setItem("formDataNav", JSON.stringify(updatedValues));
        localStorage.setItem("statusData", JSON.stringify(response.data));
        localStorage.setItem("lastSearchSource", "navbar"); // Track last search source

        window.dispatchEvent(new Event("storage"));

        console.log("Form Data:", values);
        console.log("API Response Data:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleFieldClick = () => {
    if (updatePreferences) {
      formik.submitForm();
      return;
    }
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
        localStorage.setItem("selectedAddress", formattedAddress);
        localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
      }
    }
  };

  function handleCreateOptions() {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full  border-gray-200 bg-[#FCF8F1] z-50">
      <div className="flex justify-between py-3 md:py-5 md:px-8 px-4 relative  border border-b-1  items-center gap-2 ">
        {pathname !== "/" && (
          <button onClick={toggleSidebar} className="md:hidden mb-6">
            <Menu className="w-8 h-6 text-gray-700" />
          </button>
        )}
        <div className="flex gap-4 md:w-[71%] w-full">
          <div
            onClick={() => router.push("/")}
            className="hidden md:flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/web-new-logo.svg"
              alt="New Logo"
              width={0}
              height={0}
              className="w-28 h-auto hidden md:flex"
            />
          </div>
          {pathname !== "/" && (
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col md:flex-row w-full max-w-[52rem]"
            >
              <div className="flex flex-col md:flex-row w-full relative rounded-md border border-[#333333] ">
                {/* Input Fields - Stack on mobile */}
                <div className="flex flex-col md:flex-row flex-grow w-full">
                  {/* Specialty Section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3 md:hidden">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <div
                      onClick={handleFieldClick}
                      className="flex-1 border-b border-gray-400 md:border-none"
                    >
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
                          localStorage.setItem("selectedSpecialty", value);
                        }}
                        clearable={false}
                        navbar
                        enabled={updatePreferences ? false : true}
                      />
                    </div>
                  </div>
                  {/* Insurer section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <BookText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div
                      onClick={handleFieldClick}
                      className="flex-1 border-b border-gray-400 md:border-none"
                    >
                      <Autocomplete
                        id="insurer"
                        name="insurer"
                        className="w-full"
                        options={insuranceCarrierOptions}
                        placeholder="Insurance carrier (optional)"
                        selected={formik.values.insurance_carrier}
                        onChange={(value) => {
                          setInsurer(value);
                          formik.setFieldValue("insurance_carrier", value);
                          localStorage.setItem("selectedInsurer", value);
                        }}
                        clearable={false}
                        enabled={updatePreferences ? false : true}
                      />
                    </div>
                  </div>
                  {/* Location Section */}
                  {!updatePreferences && (
                    <div className="flex items-center w-full sm:flex-1">
                      <div className="flex items-center justify-center px-3 h-full">
                        <MapPin className="w-5 h-5 text-gray-500" />
                      </div>
                      <div onClick={handleFieldClick} className="flex-1">
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
                              onChange={(e) =>
                                setAddressLocation(e.target.value)
                              }
                              autoComplete="off"
                              aria-autocomplete="none"
                            />
                          </StandaloneSearchBox>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Button - Stays on the right, filling height on mobile */}
                <button
                  className={`text-white rounded-none px-2 md:px-5 md:h-12 h-full md:w-auto absolute md:static right-0 top-0 bottom-0 border-l-0 
  bg-[#0074BA] md:bg-[#E5573F] hover:bg-[#0074BA] hover:text-white md:hover:bg-[#0074BA] md:hover:text-white rounded-tr-sm rounded-br-sm
  min-w-[48px] md:min-w-0
  ${updatePreferences ? "md:min-w-[200px]" : ""}`}
                >
                  {updatePreferences ? (
                    <>
                      {/* Mobile Text */}
                      <Search className="w-5 h-5 md:hidden font-semibold text-white" />

                      {/* Desktop Text */}
                      <span className="hidden md:inline-block text-white">
                        Update Preferences
                      </span>
                    </>
                  ) : (
                    <Search className="w-5 h-5 font-semibold text-white" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="hidden md:flex gap-6 items-center text-md font-normal text-sm">
          {/* <Link href="#">Browse</Link> */}
          <Link href="/contact-us" onClick={() => track("Help_Btn_Clicked")}>
            Help
          </Link>
          {/* <Link href="#">Log In</Link> */}
          {/* <Link href={'/'}>
            <Button className="bg-[#0074BA] text-white rounded-md">
              Get Started
            </Button>
          </Link> */}
        </div>
        {/* Mobile Hamburger */}
        {pathname == "/" && (
          <div className="md:hidden flex gap-8 items-center text-md font-normal ">
            <Link href="/contact-us" className="hover:text-gray-500">
              Help
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
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
                  src="/web-new-logo.svg"
                  alt="Docsure Logo"
                  width={0}
                  height={0}
                  className="w-28 h-auto"
                />
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
              {/* <Link href="#">Browse</Link> */}

              {/* <Link href="#">Log In</Link> */}
              {/* <Link href="/">
                <Button className="bg-[#0074BA] text-white rounded-md">
                  Get Started
                </Button>
              </Link> */}
            </nav>
          </div>

          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={closeSidebar}
          />
        </div>
      )}

      {/* Quick Details Modal */}
      <QuickDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialSpecialty={specialty}
        updatePreferences={updatePreferences}
        confirmUpdatePreferences={confirmUpdatePreferences}
        setispreferencesUpdated={setIsPreferencesUpdated}
        setIsPreferencesReinitialized={setIsPreferencesReinitialized}
      />
    </div>
  );
}
