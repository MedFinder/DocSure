//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import axios from "axios";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combo-box";

const doctorTypes = [
  "Dermatologist",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Dentist",
  "Psychiatrist",
  "Gynecologist",
  "Ophthalmologist",
  "Orthopedic",
  "ENT Specialist",
];
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
const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

export default function Home() {
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
        console.log(lat, lng);
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );

        sessionStorage.setItem("formData", JSON.stringify(updatedValues));
        sessionStorage.setItem("statusData", JSON.stringify(response.data));
        sessionStorage.setItem("lastSearchSource", "home"); // Track last search source

        router.push("/search");
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
  const handleDoctorTypeClick = (type) => {
    formik.setFieldValue("specialty", type);
    formik.setTouched({ specialty: true }); // Ensures Formik updates the field
  };

  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col items-center justify-center px-6 sm:px-10">
        {/* Centered Main Content */}
        <div className="text-start items-center space-y-4 w-full px-6 sm:px-20 lg:px-40 mt-16 md:mt-0">
          <p className="text-2xl sm:text-4xl font-semibold text-center sm:text-left mb-8 text-[#333333]">
            Book top rated doctors near you
          </p>

          {/* Combined Search Input */}

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-wrap md:flex-nowrap w-full border border-gray-500 overflow-hidden shadow-sm outline-none gap-2 md:gap-0 rounded-none "
          >
            {/* Left Section: Specialty & Location Inputs */}
            <div className="flex flex-grow items-center">
              {/* Search Icon */}
              <div className="hidden md:flex items-center justify-center px-3">
                <Search className="w-5 h-5 text-gray-500" />
              </div>

              <Combobox
                mode="single"
                id="specialty"
                name="specialty"
                className="w-full md:w-1/2 min-w-[150px] p-0 border-none bg-white focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground"
                options={medicalSpecialtiesOptions}
                placeholder="Condition, procedure, doctor"
                selected={formik.values.specialty} // Ensure this updates correctly
                onChange={(value) => {
                  formik.setFieldValue("specialty", value);
                }}
              />

              {/* Location Icon */}
              <div className="hidden md:flex items-center justify-center px-3">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>

              {/* Location Search Input (2/3 Width on Medium+ Screens) */}
              {isLoaded && (
                <StandaloneSearchBox
                  onLoad={(ref) => (inputRefs.current[0] = ref)}
                  onPlacesChanged={() => handleOnPlacesChanged(0)}
                >
                  <Input
                    type="text"
                    placeholder="Address, city, zip code"
                    className="w-full md:w-2/3 min-w-[180px] border-none focus:ring-0 focus:outline-none h-12 px-3"
                  />
                </StandaloneSearchBox>
              )}
            </div>

            {/* Search Button - Always at the Far Right Edge */}
            <Button
              disabled={isLoading}
              className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center md:flex-grow-0 md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-white" />
              )}
            </Button>
          </form>

          {/* Spaced Top Searches Section */}
          <div className="flex flex-col gap-4 pt-4">
            <span className="text-xs text-gray-900 ">Top searches</span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {doctorTypes.map((type, index) => (
                <Button
                  key={index}
                  className="rounded-full bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800 text-xs px-3 py-2 w-full sm:w-auto"
                  // onClick={() => handleDoctorTypeClick(type)} // Add onClick handler
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <Link href="" className=" w-full text-center mt-4 md:hidden">
            <p className="text-[#FF6723] underline py-2 px-4 inline-block rounded-md text-xs sm:text-sm">
              Allow location access for a smoother experience
            </p>
          </Link>
        </div>

        {/* Bottom Centered Text */}
        <Link
          href=""
          className="absolute bottom-6  w-full text-center px-4 md:block hidden"
        >
          <p className="text-[#FF6723] underline py-2 px-4 inline-block rounded-md text-xs sm:text-sm">
            Allow location access for a smoother experience
          </p>
        </Link>
      </div>
    </>
  );
}
