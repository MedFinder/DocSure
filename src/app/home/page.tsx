//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { track } from "@vercel/analytics";
import * as Yup from "yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import axios from "axios";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combo-box";
import { medicalSpecialtiesOptions } from "@/constants/store-constants";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { trackConversion } from '../../../src/lib/gtag';
import { sendGTMEvent } from "@next/third-parties/google";

const doctorTypes = [
  { value: "Dermatologist", label: "Dermatologist" },
  {
    value: "Cardiologist / Heart Doctor",
    label: "Cardiologist / Heart Doctor",
  },
  {
    value: "Neurologist / Headache Specialist",
    label: "Neurologist / Headache Specialist",
  },
  { value: "Pediatrician", label: "Pediatrician" },
  { value: "Dentist", label: "Dentist" },
  { value: "Psychiatrist", label: "Psychiatrist" },
  { value: "Ophthalmologist", label: "Ophthalmologist" },
  {
    value: "Orthopedic Surgeon / Orthopedist",
    label: "Orthopedic Surgeon / Orthopedist",
  },
];
const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

function HomePage() {
  const router = useRouter();
  const { query } = router;
  const searchParams = useSearchParams();
  const [selectedAvailability, setSelectedAvailability] = useState("anytime");
  const [timeOfAppointment, settimeOfAppointment] = useState("soonest");
  const [isnewPatient, setisnewPatient] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressLocation, setAddressLocation] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const inputRefs = useRef([]);
  const addressRefs = useRef([]);
  const [selectedOption, setSelectedOption] = useState("no");
  const [selectedDoctorType, setSelectedDoctorType] = useState(""); // Add this state to track selected button
  const [prefilledAddress, setPrefilledAddress] = useState(""); // State for prefilled address
  const [prefilledSpecialty, setPrefilledSpecialty] = useState(""); // State for prefilled specialty
  const [doctors, setDoctors] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  // const handleOnPlacesChanged = (index) => {
  //   if (inputRefs.current[index]) {
  //     const places = inputRefs.current[index].getPlaces();
  //     if (places.length > 0) {
  //       const place = places[0];
  //       const lat = place.geometry.location.lat();
  //       const lng = place.geometry.location.lng();

  //       setSelectedLocation({ lat, lng });
  //     }
  //     const placesNames = places.formatted_address;
  //   }
  // };

  // const handleOnPlacesChanged = (index) => {
  //   if (inputRefs.current[index]) {
  //     const places = inputRefs.current[index].getPlaces();
  //     if (places.length > 0) {
  //       const place = places[0];
  //       const lat = place.geometry.location.lat();
  //       const lng = place.geometry.location.lng();
  //       const formattedAddress = place.formatted_address; // Get formatted address

  //       // Set selected location state (if needed)
  //       setSelectedLocation({ lat, lng });

  //       // Store formatted address separately in sessionStorage
  //       sessionStorage.setItem("selectedAddress", formattedAddress);

  //       // Store lat/lng in sessionStorage
  //       sessionStorage.setItem(
  //         "selectedLocation",
  //         JSON.stringify({ lat, lng })
  //       );

  //       console.log("Formatted Address Stored:", formattedAddress);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   const address = query?.address; // Get the "address" query parameter
  //   const specialty = query?.specialty;

  //   if (address) {
  //     setPrefilledAddress(address);
  //     sessionStorage.setItem("selectedAddress", address);
  //     setAddressLocation(address); // Set the address location for input field
  //   }
  //   if (specialty) {
  //     setPrefilledSpecialty(specialty);
  //     sessionStorage.setItem("selectedSpecialty", specialty);
  //     // formik.setFieldValue("specialty", specialty);
  //   }

  //   // Retrieve lat/lng if available
  //   const savedLocation = sessionStorage.getItem("selectedLocation");
  //   if (savedLocation) {
  //     setSelectedLocation(JSON.parse(savedLocation));
  //   }
  // }, [searchParams]);
  const pathname = usePathname();

  useEffect(() => {
    const address = searchParams.get("address");
    const specialty = searchParams.get("specialty");

    if (address) {
      setPrefilledAddress(address);
      sessionStorage.setItem("selectedAddress", address);
      setAddressLocation(address); // Set the address location for input field
    }
    if (specialty) {
      setPrefilledSpecialty(specialty);
      sessionStorage.setItem("selectedSpecialty", specialty);
      formik.setFieldValue("specialty", specialty);
    }

    // Retrieve lat/lng if available
    const savedLocation = sessionStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation));
    }
  }, [searchParams]);
  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address; // Get formatted address

        setSelectedLocation({ lat, lng });
        setAddressLocation(formattedAddress); // Update input field state

        // Store in sessionStorage
        sessionStorage.setItem("selectedAddress", formattedAddress);
        sessionStorage.setItem(
          "selectedLocation",
          JSON.stringify({ lat, lng })
        );
      }
    }
  };
  const logRequestInfo = async () => {
    const savedAddress = sessionStorage.getItem("selectedAddress");
    const data = {
      doctor_speciality: formik.values.specialty,
      preferred_location: savedAddress,
    };
    // console.log(data)
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-request-info`,
        data
      );
      // console.log(resp)
      return resp.data?.request_id;
    } catch (error) {
      // console.error('Error logging call details:', error);
      return null;
    }
  };
  const logDrLists = async (data) => {
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-doctor-list`,
        data
      );
      return
    } catch (error) {
      // console.error('Error logging call details:', error);
      return null;
    }
  };
  
  const formik = useFormik({
    initialValues: {
      specialty: prefilledSpecialty || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("Homepage_Search_Btn_Clicked");
      // trackConversion('conversion', {
      //   label: 'x4dOCIyosK0aEP7Fg6Io', // Optional, from Google Ads
      //   value: 10.0,
      //   currency: 'USD',
      // })
      // console.log(values);
      // const updatedValues = { ...values };

      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        console.log(lat, lng);
        sessionStorage.setItem("selectedSpecialty", values.specialty);
        // sessionStorage.setItem(
        //   "selectedLocation",
        //   JSON.stringify({ lat, lng })
        // );
        sessionStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );
        const request_id = await logRequestInfo();
        // Add request_id to updatedValues if it exists
        let updatedValues = { ...values };
        if (request_id) {
          updatedValues.request_id = request_id;
        }
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );
        const payload = {
          request_id,
          ...response.data
        }
        logDrLists(payload);
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
    setSelectedDoctorType(type); // Update selected doctor type
  };

  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col items-center justify-center md:px-6 px-0 ">
        {/* Centered Main Content */}
        <div className="text-start items-center space-y-4 w-full px-6 sm:px-20 lg:px-40   md:mt-0">
          <p onClick={()=>sendGTMEvent({
      event: 'button_click',
      button_id: 'my-button',
    })} className="text-4xl sm:text-5xl text-left mb-8 text-[#333333]  font-medium md:font-normal">
            Book top rated doctors near me
          </p>

          {/* Combined Search Input - Improved Responsive Layout */}
          <form
            onSubmit={formik.handleSubmit}
            className="w-full border border-gray-500 rounded-none shadow-sm md:mb-0 "
          >
            <div className="flex flex-col md:flex-row w-full">
              {/* Container for specialty and location inputs */}
              <div className="flex flex-col sm:flex-row flex-grow w-full ">
                {/* Specialty section */}
                <div className="flex items-center w-full sm:w-auto sm:flex-1 ">
                  <div className="flex items-center justify-center px-3 ">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 border-b border-gray-400 md:border-none">
                    <Autocomplete
                      id="specialty"
                      name="specialty"
                      className="w-full"
                      options={medicalSpecialtiesOptions}
                      placeholder="Medical specialty"
                      selected={formik.values.specialty}
                      onChange={(value) => {
                        formik.setFieldValue("specialty", value);
                        setSelectedDoctorType("");
                      }}
                      clearable={false}
                    />
                  </div>
                </div>

                {/* Location section */}
                <div className="flex items-center w-full sm:flex-1">
                  <div className="flex items-center justify-center px-3 h-full">
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

              {/* Search Button */}
              <Button
                disabled={
                  isLoading || !formik.values.specialty || !selectedLocation
                }
                className="bg-[#FF6723] text-white rounded-none px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-white" />
                )}
              </Button>
            </div>
          </form>
          <div className="pt-4">
            {" "}
            <Button
              type="button" // Prevents default form submission behavior since it's outside the form
              onClick={formik.handleSubmit} // Explicitly trigger form submission
              disabled={
                isLoading || !formik.values.specialty || !selectedLocation
              }
              className="bg-[#FF6723] text-white rounded-none px-6 h-12  flex items-center justify-center w-full md:w-auto md:hidden"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <div className="flex gap-2 text-white items-center ">
                  <Search className="w-5 h-5" />
                  <p>Search</p>
                </div>
              )}
            </Button>
          </div>

          {/* Top Searches Section */}
          {/* <div className="flex flex-col gap-4 pt-4">
            <span className="text-xs text-gray-900 ">Top searches</span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {doctorTypes.map((value, index) => (
                <Button
                  key={index}
                  className={`rounded-full text-xs px-3 py-2 w-full sm:w-auto ${
                    selectedDoctorType === value.value ||
                    formik.values.specialty === value.value
                      ? "bg-slate-800 text-white" // Selected state
                      : "bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800" // Normal state
                  }`}
                  onClick={() => handleDoctorTypeClick(value.value)}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          </div> */}
          <div className="flex flex-col gap-4 md:pt-4 pt-0">
            <span className="text-xs text-gray-900">Top searches</span>
            <div className="sm:flex-wrap sm:gap-3 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 pb-2">
              {doctorTypes.map((value, index) => (
                <Button
                  key={index}
                  className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                    selectedDoctorType === value.value ||
                    formik.values.specialty === value.value
                      ? "bg-slate-800 text-white" // Selected state
                      : "bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800" // Normal state
                  }`}
                  onClick={() => handleDoctorTypeClick(value.value)}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ...existing code... */}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
