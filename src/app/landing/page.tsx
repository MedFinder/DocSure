//@ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  Book,
  BookText,
  Loader2,
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import DoctorCardCarousel from "./components/DoctorCardCarousel";
import TestSwiper from "./components/test";
import axios from "axios";
import TestimonialCarousel from "./components/Testimonial";
import TestimonialGrid from "./components/Testimonial";
import Places from "./components/Places";
import HealthConcerns from "./components/HealthConcerns";
import * as Yup from "yup";
import { track } from "@vercel/analytics";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { log } from "console";

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
const moreDoctorTypes = [
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
  {
    value: "Endocrinologist / Diabetes Specialist",
    label: "Endocrinologist / Diabetes Specialist",
  },
  { value: "Gastroenterologist", label: "Gastroenterologist" },
  {
    value: "Hematologist / Blood Specialist",
    label: "Hematologist / Blood Specialist",
  },
  {
    value: "Nephrologist / Kidney Specialist",
    label: "Nephrologist / Kidney Specialist",
  },
];
const validationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});
const scrollToSection = (id: string, offset: number) => {
  const element = document.getElementById(id);
  if (element) {
    const topPosition = element.offsetTop - offset; // Calculate position with offset
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [prefilledAddress, setPrefilledAddress] = useState(""); // State for prefilled address
  const [prefilledSpecialty, setPrefilledSpecialty] = useState(""); // State for prefilled specialty
  const [addressLocation, setAddressLocation] = useState(null);
  const [populardoctors, setpopulardoctors] = useState([]);
  const inputRefs = useRef([]);
  const addressRefs = useRef([]);

  const handleDoctorTypeClick = (value: any) => {
    formik.setFieldValue("specialty", value);
    setSelectedSpecialty(value); // Update specialty when button is clicked
  };
  const checkPrefillAvailability = (value:string) => {
    scrollToSection("home", 40); // Scroll to the "home" section
    handleDoctorTypeClick('Primary Care Physician'); // Call handleDoctorTypeClick with the provided value
   formik.handleSubmit(); // Trigger formik's onSubmit function
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });
  const insuranceFirstLogos = [
    { src: "/image 18 (1).svg", alt: "Insurance Network 3", carrier: "UnitedHealthcare" },
    { src: "/elevance.svg", alt: "Insurance Network 1", carrier: "Elevance Health" },
    { src: "/image 17 (1).svg", alt: "Insurance Network 5", carrier: "Aetna" },
    { src: "/cigna.svg", alt: "Insurance Network 5", carrier: "Cigna" },
    { src: "/image 6.svg", alt: "Insurance Network 1", carrier: "Kaiser Permanente" },
  ];
  const insuranceSecondLogos = [
    { src: "/HCSC.svg", alt: "Insurance Network 1", carrier: 'The HSC Health Care System' },
    { src: "/BCBS.svg", alt: "Insurance Network 1", carrier: 'Blue Cross Blue Shield' },
    { src: "/Highmark.svg", alt: "Insurance Network 1", carrier: 'Highmark Blue Cross Blue Shield' },
    { src: "/centene.svg",  alt: "Insurance Network 1", carrier: 'Centennial Care' },
    { src: "/humana.svg", alt: "Insurance Network 4", carrier: "Humana" },
  ];
  const insuranceLeftLogos = [
    { src: "/image 6.svg", alt: "Insurance Network 1", carrier: "https://healthy.kaiserpermanente.org/front-door" },
    { src: "/image 7.svg", alt: "Insurance Network 2", carrier: "https://www.anthem.com/" },
    { src: "/image 8.svg", alt: "Insurance Network 6", carrier: "https://www.blueshieldca.com/" },
    { src: "/image 9.svg", alt: "Insurance Network 4", carrier: "https://www.healthnet.com/content/healthnet/en_us.html" },
    { src: "/image 17 (1).svg", alt: "Insurance Network 5", carrier: "https://www.aetna.com/" },
    { src: "/image 18.svg", alt: "Insurance Network 1", carrier: "https://example7.com" },
  ];
  const insuranceRightLogos = [
    { src: "/image 6.svg", alt: "Insurance Network 1", carrier: "https://healthy.kaiserpermanente.org/front-door" },
    { src: "/image 11.svg", alt: "Insurance Network 1", carrier: "https://example7.com" },
    { src: "/image 12.svg", alt: "Insurance Network 2", carrier: "https://example8.com" },
    { src: "/image 13.svg", alt: "Insurance Network 3", carrier: "https://example9.com" },
  ];
  useEffect(() => {
    fetchUserLocationAndPopularDrs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getPopularDrs = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=Primary Care Physician`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching popular doctors:", error);
      return [];
    }
  };

  const fetchUserLocationAndPopularDrs = async () => {
    const storedDoctors = sessionStorage.getItem("popularDoctors");
    const storedAddress = sessionStorage.getItem("selectedAddress");
    const storedLocation = sessionStorage.getItem("selectedLocation");
    if (storedAddress) { 
      setAddressLocation(storedAddress); 
     }
     if (storedLocation) { 
      const { lat, lng } = JSON.parse(storedLocation);
      setSelectedLocation({ lat, lng });
     }
    if (storedDoctors) {
      const parsedDoctors = JSON.parse(storedDoctors);
      if (parsedDoctors?.length > 0) {
        setpopulardoctors(parsedDoctors);
        return;
      }
    }

    const defaultLat = 37.7749; // Default latitude (e.g., San Francisco)
    const defaultLng = -122.4194; // Default longitude (e.g., San Francisco)

    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by your browser. Using default location."
      );
      const popularDoctors = await getPopularDrs(defaultLat, defaultLng);
      if (popularDoctors?.results?.length > 0) {
        const doctorlists = popularDoctors?.results?.slice(0, 20);
        setpopulardoctors(doctorlists);
        sessionStorage.setItem("popularDoctors", JSON.stringify(doctorlists));
      }
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Fetch the address using Google Maps Geocoding API
          const geocodeResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A`
          );

          const address = geocodeResponse.data.results[0]?.formatted_address || "";
          // console.log(address)
          setSelectedLocation({ lat, lng });
          setAddressLocation(address); // Set the fetched address
          sessionStorage.setItem("selectedAddress", address);
          sessionStorage.setItem(
            "selectedLocation",
            JSON.stringify({ lat, lng })
          );

          const popularDoctors = await getPopularDrs(lat, lng);
          if (popularDoctors?.results?.length > 0) {
            const doctorlists = popularDoctors?.results?.slice(0, 20);
            setpopulardoctors(doctorlists);
            sessionStorage.setItem("popularDoctors", JSON.stringify(doctorlists));
          }
        } catch (error) {
          console.error("Error fetching address or popular doctors:", error);
        }
      },
      async (error) => {
        console.error("Error getting location:", error);
        // toast.error("Unable to retrieve your location. Using default location.");
        const popularDoctors = await getPopularDrs(defaultLat, defaultLng);
        if (popularDoctors?.results?.length > 0) {
          const doctorlists = popularDoctors?.results?.slice(0, 20);
          setpopulardoctors(doctorlists);
          sessionStorage.setItem("popularDoctors", JSON.stringify(doctorlists));
        }
      }
    );
  };
  const logRequestInfo = async () => {
    const savedAddress = sessionStorage.getItem("selectedAddress");
    const data = {
      doctor_speciality: formik.values.specialty,
      preferred_location: savedAddress,
    };
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-request-info`,
        data
      );
      return resp.data?.request_id;
    } catch (error) {
      return null;
    }
  };
  const formik = useFormik({
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
      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }
      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        sessionStorage.setItem("selectedSpecialty", values.specialty);
        sessionStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
        );

        // Call logRequestInfo without awaiting
        const requestIdPromise = logRequestInfo();
        const speciality_value = formik.values.specialty === 'Prescription / Refill' ? 'Primary Care Physician' : formik.values.specialty;

        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${speciality_value}`
        );

        // Handle request_id when the promise resolves
        requestIdPromise.then((request_id) => {
          if (request_id) {
            const updatedValues = { ...values, request_id };
            sessionStorage.setItem("formData", JSON.stringify(updatedValues));
          }
        });

        sessionStorage.setItem("statusData", JSON.stringify(response.data));
        sessionStorage.setItem("lastSearchSource", "home"); // Track last search source
        router.push("/search");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  const handleOnAddressChanged = (index) => {
    if (addressRefs.current[index]) {
      const places = addressRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        const address = places[0];
        formik.setFieldValue("address", address?.formatted_address);
      }
    }
  };
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

  const PrefillLocation = (location: string) => {
    scrollToSection("home", 40);
    setAddressLocation(location);
  };

  return (
    <div className="min-h-screen w-full bg-[#FCF8F1]  ">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50  text-sm">
        <div className="flex justify-between items-center gap-6">
          <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-28 h-auto hidden md:flex cursor-pointer"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              scrollToSection("home", 40); // Scroll to 'doctors' section with 80px offset
            }}
          />
          <Image
            src="/mobile-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-auto h-auto block md:hidden cursor-pointer"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              scrollToSection("home", 40); // Scroll to 'doctors' section with 80px offset
            }}
          />
          <div className="space-x-6 hidden md:block">
            <Link
              href="#"
              className="hover:text-[#E5573F]"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                scrollToSection("doctors", 60); // Scroll to 'doctors' section with 80px offset
              }}
            >
              Doctors
            </Link>
            <Link
              href="#"
              className="hover:text-[#E5573F]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("specialties", 60);
              }}
            >
              Specialties
            </Link>
          </div>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("how_it_works", 60);
            }}
          >
            How it works
          </Link>
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("locations", 60);
            }}
          >
            Locations
          </Link>
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("insurance_plans", 70);
            }}
          >
            Insurance Plans
          </Link>
          <Link
            className="hover:text-[#E5573F]"
            onClick={() => track("Help_Btn_Clicked")}
            href="/contact-us"
          >
            Help
          </Link>
          <Button
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }}
            className="text-white bg-[#0074BA] rounded-md"
          >
            Get Started
          </Button>
        </div>

        <div className="md:hidden flex space-x-4">
          <Button className="text-white bg-[#0074BA] rounded-md block md:hidden text-xs ">
            Get Started
          </Button>
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <AlignLeft size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 bg-white h-full p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mb-4 flex " onClick={() => setIsOpen(false)}>
              <X size={24} /> <p className="text-[#E5573F] space-x-1"></p>
            </button>

            <nav className="flex flex-col space-y-4">
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how_it_works", 60);
                }}
              >
                How it works
              </Link>
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("locations", 60);
                }}
              >
                Locations
              </Link>
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("insurance_plans", 60);
                }}
              >
                Insurance Plans
              </Link>
              <Link
                className="hover:text-[#E5573F]"
                onClick={() => track("Help_Btn_Clicked")}
                href="/contact-us"
              >
                Help
              </Link>

              {/* <a
                href="#contact"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a> */}
            </nav>
          </div>
        </div>
      )}

      {/* Sections */}
      <main className="">
        <section
          id="home"
          className="md:h-[65vh] h-auto md:pt-24 pt-36 flex flex-col items-center justify-center bg-[#FCF8F1]  border-b relative"
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

            <form
              onSubmit={formik.handleSubmit}
              className="flex gap-2 w-full pt-4"
            >
              <div className="flex flex-col md:flex-row w-full bg-white rounded-md border border-black">
                {/* Specialty and location inputs */}
                <div className="flex flex-col sm:flex-row flex-grow w-full">
                  {/* Specialty section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-400 md:border-none">
                      <Autocomplete
                        id="specialty"
                        name="specialty"
                        className="w-full"
                        options={medicalSpecialtiesOptions}
                        placeholder="Medical specialty"
                        value={selectedSpecialty}
                        selected={formik.values.specialty}
                        onChange={(value) => {
                          formik.setFieldValue("specialty", value);
                          setSelectedSpecialty(value);
                        }}
                        clearable={false}
                      />
                    </div>
                  </div>
                  {/* Insurer section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <BookText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-400 md:border-none">
                      <Autocomplete
                        id="insurer"
                        name="insurer"
                        className="w-full"
                        options={insuranceCarrierOptions}
                        placeholder="Insurance carrier (optional)"
                        value={formik.values.insurance_carrier}
                        selected={formik.values.insurance_carrier}
                        onChange={(value) => {
                          formik.setFieldValue("insurance_carrier", value);
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
                  <div className="mx-3">
                    <Button className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 my-4 h-12 items-center justify-center w-full md:w-auto md:hidden">
                      <Search className="w-5 h-5 text-white" /> Search
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                disabled={
                  isLoading || !formik.values.specialty || !selectedLocation
                }
                onClick={formik.handleSubmit} // Explicitly trigger form submission
                type="submit"
                className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden"
              >
                {/* <Search className="w-5 h-5 text-white" /> Search */}
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />{" "}
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 text-white" /> Search
                  </>
                )}
              </Button>
            </form>

            {/* Specialty Selection */}
            <ScrollArea className="w-full whitespace-nowrap md:flex gap-4 md:pt-4 pt-0 hidden">
              <div className="flex gap-4 px-1 pb-2 md:max-w-full max-w-[50%] justify-center">
                {doctorTypes.map((value, index) => (
                  <Button
                    key={index}
                    className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                      selectedSpecialty === value.value
                        ? "bg-slate-800 text-white" // Selected state
                        : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800" // Normal state
                    }`}
                    onClick={() => handleDoctorTypeClick(value.value)}
                  >
                    {value.label}
                  </Button>
                ))}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="block md:block lg:hidden"
              />
            </ScrollArea>
            <div></div>

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
            width={0}
            height={0}
            className="absolute bottom-0 left-0 w-auto h-auto max-w-[180px] md:max-w-[180px] hidden md:block"
          />
          <Image
            src="/serious-mature-doctor-eyeglasses-sitting-table-typing-laptop-computer-office 1.svg"
            alt="Doctor"
            width={0}
            height={0}
            className="absolute bottom-0 right-0 w-auto h-auto max-w-[180px] md:max-w-[250px] hidden md:block"
          />
        </section>

        <section
          id="about"
          className=" md:flex flex-col items-center justify-center gap-24 bg-white border-b md:py-12 px-0 md:px-64 hidden"
        >
          <div className="flex gap-12 px-14">
            <div className="pt-24 px-4">
              <p className="text-2xl ">Find doctors in any insurance network</p>
              <div className="flex flex-wrap gap-4 pt-6">
                {insuranceLeftLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    className="w-auto h-auto hidden md:flex"
                  />
                ))}
              </div>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home", 40);
                }}
                href=""
                className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/Group 233.svg"
                alt="doctor"
                width={600}
                height={600}
                className=""
              />
              <div className="absolute top-20 left-4 max-w-[40%] text-white py-2">
                <h2 className="text-2xl">Over 1M doctors</h2>
                <p className="py-4 text-sm">Largest selection of providers across<br/><span className="font-bold">60+ specialities</span></p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-12 px-14">
            <div className="bg-[#0074BA] rounded-2xl relative flex justify-between items-center">
              {/* Left Content - Texts and Stars */}
              <div className="flex flex-col justify-start text-left pl-6 gap-4">
                <p className="text-white text-3xl">Top-rated providers</p>
                <p className="text-white">
                  Compare across hundreds of public reviews
                </p>

                {/* Star Container */}
                <div className="relative w-full flex flex-col items-center pr-16 mt-4">
                  {/* Top 3 Stars */}
                  <div className="flex gap-4">
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Bottom 2 Stars */}
                  <div className="flex gap-4 mt-2">
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>

              {/* Right Content - Images */}
              <div className="relative h-full w-[70%] flex items-center justify-center">
                {/* Background Mask Group - Full Width & Height */}
                <Image
                  src="/Mask group (1).svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />

                {/* Foreground Group 167 - Full Height */}
                <Image
                  src="/Group 167.svg"
                  alt="Doctor Illustration"
                  width={300}
                  height={800}
                  className="relative h-full object-contain"
                />
              </div>
            </div>

            <div className="pt-10 px-4">
              <p className="text-2xl ">Find providers at top health systems</p>
              <div className="flex flex-wrap gap-4 pt-6">
                {insuranceRightLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    className="w-auto h-auto hidden md:flex"
                  />
                ))}
              </div>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home", 40);
                }}
                href=""
                className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="flex  px-14">
            <div className="pt-20 w-[50%] ">
              <p className="text-3xl ">Find doctors accepting new patients</p>
              <p className="pt-4 text-sm">
                Same-day and last-minute appointments
              </p>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home", 40);
                }}
                href=""
                className=" text-[#E5573F] flex gap-1 pt-16 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
            <div className="bg-[#2CA07F] rounded-2xl relative flex items-center h-80 overflow-hidden w-[60%]">
              {/* Left Content - Texts (Slightly Overlapping Images) */}
              <div className="absolute bottom-6 left-6 z-10 flex flex-col text-left gap-2 bg-opacity-50 ">
                <p className="text-white text-3xl  leading-tight w-[65%]">
                  No insurance, no problem
                </p>
                <p className="text-white w-1/2">
                  Find doctors that accept self-pay
                </p>
              </div>

              {/* Right Content - Images Fully to the Right */}
              <div className="relative w-full h-full flex justify-end ">
                {/* Background Mask - Covers Right Half */}
                <Image
                  src="/Mask group.svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 right-0 w-full h-full"
                />

                {/* Foreground - Doctor Image (Right-Aligned & Text Overlap) */}
                <Image
                  src="/doc-and-nurse.svg"
                  alt="Doctor Illustration"
                  width={400}
                  height={500}
                  className="relative h-full object-cover ml-auto"
                />
              </div>
            </div>
          </div>
        </section>
        {/* mobile view for 2nd section */}
        <section
          id="about"
          className=" flex-col items-center justify-center gap-24 bg-white border-b pt-6 md:px-64 md:hidden block text-left"
        >
          {/* First Section */}
          <div className="flex flex-col md:flex-row gap-12 px-4 md:px-14">
            <div className="flex justify-center relative">
              <Image
                src="/Group 233.svg"
                alt="doctor"
                width={400}
                height={400}
                className="md:w-[600px] md:h-[600px]"
              />
              <div className="absolute top-20 left-4 max-w-[40%] text-white py-5">
                <h2 className="text-2xl">Over 1M doctors</h2>
                <p className="py-4">Largest selection of providers across <span className="font-bold">60+ specialities</span></p>
              </div>
            </div>
          </div>
          <div className="pt-10 px-4 ">
            <p className="text-2xl md:text-3xl">
              Find doctors in any insurance network
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6">
              {insuranceLeftLogos.map((logo, index) => (
                <Image
                  key={index}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo?.width ?? 0}
                  height={logo?.heigt ?? 0}
                  className="w-auto h-auto"
                />
              ))}
            </div>
            <Link
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home", 40);
              }}
              href=""
              className="text-[#E5573F] flex gap-1 pt-8 md:pt-12 hover:text-black"
            >
              Get Started <ArrowRight />
            </Link>
          </div>

          {/* Second Section */}
          <div className="flex flex-col md:flex-row gap-6 px-4 pt-8 ">
            <div
              className="bg-[#0074BA] rounded-2xl relative flex h-64
             md:flex-row justify-between items-center pl-4 md:p-6"
            >
              {/* Left Content */}
              <div className="flex flex-col justify-start text-left gap-1 md:gap-2 md:pl-6 w-full">
                <p className="text-white text-2xl md:text-3xl">
                  Top-rated providers
                </p>
                <p className="text-white text-sm pt-2">
                  Compare across hundreds of public reviews
                </p>

                {/* Star Container */}
                <div
                  className="relative flex flex-col items-center pr-8
                  md:pr-16 mt-1 md:mt-4"
                >
                  <div className="flex gap-4 pt-2">
                    {[...Array(3)].map((_, i) => (
                      <Image
                        key={i}
                        src="/Star 7.svg"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4  mt-1 md:mt-2">
                    {[...Array(2)].map((_, i) => (
                      <Image
                        key={i}
                        src="/Star 7.svg"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="relative w-full md:w-[70%] flex items-center justify-center h-full">
                <Image
                  src="/Mask group (1).svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
                <Image
                  src="/Group 167.svg"
                  alt="Doctor Illustration"
                  width={180}
                  height={400}
                  className="relative h-full  md:max-h-none object-contain"
                />
              </div>
            </div>

            <div className="pt-6 text-left">
              <p className="text-2xl">Find providers at top health systems</p>
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6 md:pt-4">
                {insuranceRightLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    className="w-auto h-8 md:h-auto flex"
                  />
                ))}
              </div>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home", 40);
                }}
                href=""
                className="text-[#E5573F] flex gap-1 pt-4 md:pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Third Section */}
          <div className="flex flex-col md:flex-row gap-12 px-4 md:px-14 pt-8">
            <div className="bg-[#2CA07F] rounded-2xl relative flex items-center h-64 w-full md:w-[60%] overflow-hidden">
              {/* Left Content - Slightly Overlapping Images */}
              <div
                className="absolute 
               left-2 w-56 z-10 flex flex-col text-left gap-1 md:gap-2"
              >
                <p className="text-white text-2xl md:text-3xl leading-tight w-[80%] md:w-[65%]">
                  No insurance, no problem
                </p>
                <p className="text-white w-4/5 md:w-2/3 text-sm md:text-base">
                  Find doctors that accept self-pay
                </p>
              </div>

              {/* Right Content - Images Fully to the Right */}
              <div className="relative w-full h-full flex justify-end">
                <Image
                  src="/Mask group.svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 right-0 w-full h-full"
                />
                <Image
                  src="/doc-and-nurse.svg"
                  alt="Doctor Illustration"
                  width={250}
                  height={500}
                  className="relative h-full object-cover ml-auto"
                />
              </div>
            </div>
            <div className=" md:pt-20 w-full md:w-[50%] text-left pb-14">
              <p className="text-2xl md:text-3xl">
                Find doctors accepting new patients
              </p>
              <p className="pt-2 ">Same-day and last-minute appointments</p>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home", 40);
                }}
                href=""
                className="text-[#E5573F] flex gap-1 pt-6 md:pt-16 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how_it_works"
          className="flex flex-col items-center justify-center gap-10 bg-[#0074BA] border-b md:py-16 py-8 px-0 md:px-44 text-white  "
        >
          <h2 className="text-3xl ">How it works</h2>
          <p className="md:max-w-lg px-8 md:px-0 text-center">
            Skip the hassle of calling multiple doctor's offices. Our AI takes
            care of your scheduling needs.
          </p>
          <div className="md:grid grid-cols-3 flex flex-col px-4 gap-12 md:pt-4 pt-0">
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-12 pb-6 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 189.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%] w-60 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40 ">
                  <p className=" text-center pt-4">
                    Enter your appointment details
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-24 pb-12 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 190.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%] w-60 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40">
                  <p className=" text-center pt-4">
                    Our AI makes the calls and books the appointment
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-20 pb-12 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 191.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%]  w-48 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40">
                  <p className=" text-center pt-6">
                    Receive instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="doctors"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 pb-16 px-0"
        >
          <h2 className="text-3xl md:px-44 mb-10 px-4 flex text-center">
            Top-rated doctors in your area
          </h2>
          <DoctorCardCarousel doctors={populardoctors} checkPrefillAvailability={checkPrefillAvailability} />
        </section>
        <section className="flex flex-col items-center justify-center gap-10 bg-[#E5573F] text-white border-b md:pt-16 md:pb-16 py-8 px-0   ">
          <h2 className="text-3xl md:px-44 mb-4 text-white ">
            Patients love Docsure
          </h2>
          <TestimonialCarousel />
        </section>
        <section
          id="specialties"
          className="relative flex flex-col items-center justify-center gap-10 bg-white  md:pt-16 md:pb-16 pt-8 px-0  pb-0"
        >
          {/* Section Heading */}
          <h2 className="text-3xl md:px-44 px-4 flex text-center">
            Browse specialties
          </h2>

          {/* Doctor Specialties Buttons */}
          <div className="sm:flex-wrap sm:gap-3 flex flex-wrap justify-center gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 md:px-40">
            {moreDoctorTypes.map((value, index) => (
              <Button
                key={index}
                className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                  selectedSpecialty === value.value
                    ? "bg-slate-800 text-white" // Selected state
                    : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800" // Normal state
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

          {/* Positioned Image Slightly Above Bottom with No Extra Space Below */}
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
        <section className="bg-white h-[88px]"></section>
        <section
          id="locations"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2]  border-b md:pt-16 md:pb-16 py-8 px-0   "
        >
          <h2 className="text-3xl md:px-44 mb-4 ">Browse Locations</h2>
          <Places
            PrefillLocation={PrefillLocation}
            addressLocation={addressLocation}
          />
          <div
            id="insurance_plans"
            className="px-20 bg-white  border-lg py-14 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl mb-4 whitespace-nowrap ">
              Browse insurance plans
            </h2>

            <div className="flex flex-col pt-4">
              {/* First Row - 6 Columns */}
              <div className="flex flex-wrap gap-4 justify-center">
              {/* <div className="grid md:grid-cols-6 grid-cols-2 gap-8 md:gap-0 justify-center pt-4"> */}

                {insuranceFirstLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    onClick={() => {
                      scrollToSection("home", 40);
                      formik.setFieldValue("insurance_carrier", logo?.carrier);
                    }}
                    className="w-auto h-auto  md:flex cursor-pointer"
                  />
                ))}
              </div>

              {/* Second Row - 3 Columns */}
              <div className="flex gap-4 justify-center pt-6">
                {insuranceSecondLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    onClick={() => {
                      scrollToSection("home", 40);
                      formik.setFieldValue("insurance_carrier", logo?.carrier);
                    }}
                    className="w-auto h-auto hidden md:flex cursor-pointer"
                  />
                ))}
              </div>
            </div>
            <Link
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home", 40);
              }}
              href=""
              className=" flex justify-center gap-1 pt-12 hover:text-gray-700"
            >
              Get Started <ArrowRight />
            </Link>
          </div>
          <div>
            <HealthConcerns
              onClickAction={(speciality: string) => {
                scrollToSection("home", 40);
                handleDoctorTypeClick(speciality);
              }}
            />
          </div>
        </section>
        {/* Footer Section */}
        <section className="bg-white py-8 flex flex-col  justify-center items-center">
          <Image
            src="/Vector (9).svg"
            alt="New Logo"
            width={40}
            height={40}
            className=""
          />
          <p>© 2025 Docure AI Inc.</p>
          <div className="flex gap-2">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/contact-us" className="hover:underline">Contact Us</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
