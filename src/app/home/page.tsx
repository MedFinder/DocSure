//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixed, MapPin, Search } from "lucide-react";
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
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  objective: Yup.string().required("Required"),
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
      patientName: "",
      phoneNumber: "",
      email: "",
      patientHistory: "",
      objective: "",
      specialty: "",
      groupId: "",
      subscriberId: "",
      insurer: "",
      zipcode: "",
      dob: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        selectedAvailability,
        timeOfAppointment,
        isnewPatient,
        selectedOption,
      };
      // console.log(updatedValues)
      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );

        sessionStorage.setItem("formData", JSON.stringify(updatedValues));
        sessionStorage.setItem("statusData", JSON.stringify(response.data));

        // console.log("Form Data:", values);
        // console.log("API Response Data:", response.data);
        // Navigate to status page
        router.push("/status");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  useEffect(() => {
    if (selectedOption === "no") {
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("groupId", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

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
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col items-center justify-center px-6 sm:px-10">
        {/* Centered Main Content */}
        <div className="text-start items-center space-y-8 w-full px-6 sm:px-20 lg:px-40 mt-16 md:mt-0">
          <p className="text-2xl sm:text-4xl font-semibold text-center sm:text-left">
            Book top-rated doctors near you
          </p>

          {/* Combined Search Input */}
          <form className="flex flex-wrap md:flex-nowrap w-full border md:border-gray-600 rounded-none overflow-hidden shadow-sm outline-none  gap-2 md:gap-0">
            {/* Search Icon */}
            <div className="flex items-center justify-center px-3 ">
              <Search className="w-5 h-5 text-gray-500 hidden md:block" />
            </div>

            {/* First Input */}
            <Input
              type="text"
              placeholder="Condition, procedure, doctor"
              className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
            />

            {/* Location Icon */}
            <div className="hidden md:flex items-center justify-center px-3 ">
              <MapPin className="w-5 h-5 text-gray-500" />
            </div>

            {/* Second Input */}
            <Input
              type="text"
              placeholder="Address, city, zip code"
              className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
            />

            {/* Search Button */}
            <Link href="/search">
              <Button className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center w-full md:w-0">
                <Search className="text-white w-5 h-5" />
              </Button>
            </Link>
          </form>

          {/* Spaced Top Searches Section */}
          <div className="flex flex-col gap-4">
            <span className="text-xs text-gray-900 py-2">Top searches</span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {doctorTypes.map((type, index) => (
                <Button
                  key={index}
                  className="rounded-full bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800 text-xs px-3 py-2 w-full sm:w-auto"
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
