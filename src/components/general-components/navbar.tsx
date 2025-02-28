//@ts-nocheck
"use client";
import { Menu, X, Search, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Detect the current page
import React, { useRef, useState } from "react";
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

const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});
const medicalSpecialtiesOptions = [
  { value: "allergy and immunology", label: "Allergy and Immunology" },
  { value: "anesthesiology", label: "Anesthesiology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "cardiothoracic surgery", label: "Cardiothoracic Surgery" },
  {
    value: "Colon and rectal surgery (proctology)",
    label: "Colon and Rectal surgery (Proctology)",
  },
  {
    value: "Cosmetic & Restorative Dentistry",
    label: "Cosmetic & Restorative Dentistry",
  },
  { value: "critical care medicine", label: "Critical Care Medicine" },
  { value: "dentist", label: "Dentist" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Emergency Medicine", label: "Emergency Medicine" },
  { value: "Endodontics", label: "Endodontics" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Family Medicine", label: "Family Medicine" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  {
    value: "General & Preventive Dentistry",
    label: "General & Preventive Dentistry",
  },
  { value: "General Surgery", label: "General Surgery" },
  { value: "Genetics", label: "Genetics" },
  { value: "Geriatrics", label: "Geriatrics" },
  { value: "Hematology", label: "Hematology" },
  { value: "Infectious Disease", label: "Infectious Disease" },
  { value: "Internal Medicine", label: "Internal Medicine" },
  { value: "Nephrology", label: "Nephrology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Neurosurgery", label: "Neurosurgery" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  {
    value: "Oral and Maxillofacial Surgery",
    label: "Oral and Maxillofacial Surgery",
  },
  { value: "Orthodontics", label: "Orthodontics" },
  { value: "Orthopedic Surgery", label: "Orthopedic Surgery" },
  { value: "Otolaryngology (ENT)", label: "Otolaryngology (ENT)" },
  { value: "Pediatric Dentistry", label: "Pediatric Dentistry" },
  { value: "Pediatric Surgery", label: "Pediatric Surgery" },
  { value: "Pediatrics", label: "Pediatrics" },
  {
    value: "Periodontics & Implant Dentistry",
    label: "Periodontics & Implant Dentistry",
  },
  {
    value: "Physical Medicine and Rehabilitation (Physiatry)",
    label: "Physical Medicine and Rehabilitation (Physiatry)",
  },
  { value: "Plastic Surgery", label: "Plastic Surgery" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Radiology", label: "Radiology" },
  { value: "Rheumatology", label: "Rheumatology" },
  { value: "Sleep Medicine", label: "Sleep Medicine" },
  { value: "Sports Medicine", label: "Sports Medicine" },
  { value: "Therapy and Counseling", label: "Therapy and Counseling" },
  { value: "Urology", label: "Urology" },
  { value: "Vascular Surgery", label: "Vascular Surgery" },
];
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  const formik = useFormik({
    initialValues: {
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

  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
      }
    }
  };
  const handleOnAddressChanged = (index) => {
    if (addressRefs.current[index]) {
      const places = addressRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        // <-- Added defensive check
        const address = places[0];
        //console.log(address)
        formik.setFieldValue("address", address?.formatted_address);
      }
    }
  };

  function handleCreateOptions() {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 w-full border-b-2 border-gray-200 bg-white z-50">
      <div className="flex justify-between py-5 px-8 relative items-center">
        {/* Left Section: Logo & Search (only on Search Page) */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <span className="text-[#FF6723] font-semibold text-xl whitespace-nowrap">
            DocSure AI
          </span>

          {/* Conditionally Show Search Bar on Search Page */}
          {pathname !== "/" && (
            // <div className="hidden md:flex w-[38rem] border border-gray-400  overflow-hidden shadow-sm outline-none">
            //   {/* Search Icon */}

            //   {/* First Input */}
            //   <Input
            //     type="text"
            //     placeholder="Condition, procedure, doctor"
            //     className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm ml-1"
            //   />

            //   {/* Second Input */}
            //   <Input
            //     type="text"
            //     placeholder="Address, city, zip code"
            //     className="w-full border-none focus:ring-0 focus:outline-none h-12  text-sm"
            //   />

            //   {/* Search Button */}
            //   <Button className="bg-[#FF6723] text-white rounded-none px-6 h-12">
            //     <Search className="text-white w-5 h-5" />
            //   </Button>
            // </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap md:flex-nowrap w-full border md:border-gray-600 rounded-none overflow-hidden shadow-sm outline-none  gap-2 md:gap-0"
            >
              {/* Search Icon */}
              <div className="flex items-center justify-center px-3 ">
                <Search className="w-5 h-5 text-gray-500 hidden md:block" />
              </div>
              <ComboboxNav
                mode="single"
                id="specialty"
                name="specialty"
                className="w-full md:w-1/2 min-w-[150px] p-0 border-none bg-white focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground py-1"
                options={medicalSpecialtiesOptions}
                placeholder="Condition, procedure, doctor"
                selected={formik.values.specialty}
                onChange={(value) => {
                  console.log("Selected value:", value);
                  formik.setFieldValue("specialty", value);
                }}
              />

              {/* First Input */}
              {/* <Input
              type="text"
              placeholder="Condition, procedure, doctor"
              className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
            /> */}

              <div className="hidden md:flex items-center justify-center px-3 ">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>

              {/* Second Input */}

              {isLoaded && (
                <StandaloneSearchBox
                  onLoad={(ref) => (inputRefs.current[0] = ref)}
                  onPlacesChanged={() => handleOnPlacesChanged(0)}
                >
                  <Input
                    type="text"
                    placeholder="Address, city, zip code"
                    className="w-[22rem] border-none focus:ring-0 focus:outline-none h-12 px-3"
                  />
                </StandaloneSearchBox>
              )}
              {/* Search Button */}

              <Button
                // disabled={isLoading}
                className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center w-full md:w-0"
              >
                <Search className="text-white w-5 h-5" />
              </Button>
            </form>
          )}
        </div>

        {/* Desktop Menu */}
        {/* <div className="hidden md:flex gap-8 items-center text-md font-normal">
          <Link href="/" className="hover:text-gray-500">
            Browse
          </Link>
          <Link href="/contact-us" className="hover:text-gray-500">
            Help
          </Link>
          <Link href="" className="hover:text-gray-500">
            Log In{" "}
          </Link>
          <Button className="bg-[#0074BA] rounded-none py-6">Sign Up</Button>
        </div> */}

        {/* Mobile Hamburger */}
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="w-8 h-8 text-gray-700" />
        </button>
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
