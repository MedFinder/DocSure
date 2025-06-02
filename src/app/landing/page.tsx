//@ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  Book,
  BookText,
  GiftIcon,
  Loader2,
  LucideStethoscope,
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import DoctorCardCarousel from "../landing/components/DoctorCardCarousel";
import TestSwiper from "../landing/components/test";
import axios from "axios";
import TestimonialCarousel from "../landing/components/Testimonial";
import TestimonialGrid from "../landing/components/Testimonial";
import Places from "../landing/components/Places";
import HealthConcerns from "../landing/components/HealthConcerns";
import * as Yup from "yup";
import { track } from "@vercel/analytics";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { log } from "console";
import "../landing/components/style.css";
import AboutContentRight from "../landing/components/AboutContentRight";
import AboutContentLeft from "../landing/components/AboutContentLeft";
import { Footer } from "react-day-picker";
import FooterSection from "../landing/components/FooterSection";
import Select from "@/components/ui/client-only-select";

// Add global spinner component
const GlobalSpinner = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-5 rounded-full">
        <Loader2 className="w-10 h-10 text-[#E5573F] animate-spin" />
      </div>
    </div>
  );
};
export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "none",
    borderRadius: "0.5rem",
    minHeight: "40px",
    fontSize: "14px",
    padding: "2px 4px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
    textAlign: "left",
    whiteSpace: "nowrap", // prevent line breaks
    overflow: "hidden", // hide overflowed text
    textOverflow: "ellipsis", // add "..." when text is too long
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#111827",
    textAlign: "left",
  }),
  input: (provided) => ({
    ...provided,
    color: "#111827",
    textAlign: "left",
    margin: 0,
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0, // no space between input and dropdown
    borderRadius: "0 0 0.5rem 0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%", // match input width
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#111827",
    padding: "10px 12px",
    cursor: "pointer",
    textAlign: "left",
  }),
  indicatorsContainer: () => ({
    display: "none", // removes the dropdown arrow
  }),
};

const doctorTypes = [
  { value: "Primary care doctor", label: "Primary care doctor" },
  {
    value: "Dermatologist",
    label: "Dermatologist",
  },
  {
    value: "OB-GYN (Obstetrician-Gynecologist)",
    label: "OB-GYN (Obstetrician-Gynecologist)",
  },
  { value: "Dentist", label: "Dentist" },
  { value: "Psychiatrist", label: "Psychiatrist" },
  { value: "Psychologist", label: "Psychologist" },
  { value: "Optometrist", label: "Optometrist" },
  {
    value: "Podiatrist / Foot and Ankle Specialist",
    label: "Podiatrist / Foot and Ankle Specialist",
  },
  {
    value: "Orthopedic Surgeon / Orthopedist",
    label: "Orthopedic Surgeon / Orthopedist",
  },
  {
    value: "Chiropractor",
    label: "Chiropractor",
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
  // specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
});

export default function LandingPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(""); // ✅
  const [selectedInsurer, setSelectedInsurer] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false); // Add state for global spinner
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [prefilledAddress, setPrefilledAddress] = useState(""); // State for prefilled address
  const [prefilledSpecialty, setPrefilledSpecialty] = useState(""); // State for prefilled specialty
  const [addressLocation, setAddressLocation] = useState(null);
  const [populardoctors, setpopulardoctors] = useState([]);
  const inputRefs = useRef([]);
  const addressRefs = useRef([]);
  console.log(selectedSpecialty, selectedInsurer);
  const handleDoctorTypeClick = (value: any) => {
    formik.setFieldValue("specialty", value);
    setSelectedSpecialty(value); // Update specialty when button is clicked
  };
  const scrollToSection = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const topPosition = element.offsetTop - offset; // Calculate position with offset
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };
  const updateInsuranceInStorage = (value) => {
    // Update insurer in formData
    const existingFormData = localStorage.getItem("formData");
    let formDataObj = existingFormData ? JSON.parse(existingFormData) : {};
    formDataObj.insurer = value;
    localStorage.setItem("formData", JSON.stringify(formDataObj));
    localStorage.setItem("lastSearchSource", "insurance"); // Track last search source
    window.dispatchEvent(new Event("storage"));
  };
  const updateSpecialtyInStorage = (value) => {
    // Update specialty in formData
    const existingFormData = localStorage.getItem("formData");
    let formDataObj = existingFormData ? JSON.parse(existingFormData) : {};
    formDataObj.specialty = value;
    localStorage.setItem("formData", JSON.stringify(formDataObj));
  };
  const updateAddressInStorage = (value) => {
    // Update address in formData
    const existingFormData = localStorage.getItem("formData");
    let formDataObj = existingFormData ? JSON.parse(existingFormData) : {};
    formDataObj.address = value;
    localStorage.setItem("formData", JSON.stringify(formDataObj));
  };
  const checkPrefillAvailability = (value: string, insurance: string) => {
    console.log(value, "value");
    setGlobalLoading(true); // Set global loading to true when starting the process
    // scrollToSection("home", 40); // Scroll to the "home" section
    handleDoctorTypeClick(value ?? "Primary Care Physician"); // Call handleDoctorTypeClick with the provided value
    if (insurance) {
      setSelectedInsurer(insurance);
      formik.setFieldValue("insurer", insurance);
    }
    updateSpecialtyInStorage(value ?? "Primary Care Physician");
    formik.handleSubmit(); // Trigger formik's onSubmit function
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDCPbnPb43gQZDPT5dpq10a3dOP3EMHw-0",
    libraries: ["places"],
  });
  const insuranceFirstLogos = [
    {
      src: "/image 18 (1).svg",
      alt: "Insurance Network 3",
      carrier: "UnitedHealthcare",
    },
    {
      src: "/elevance.svg",
      alt: "Insurance Network 1",
      carrier: "Elevance Health",
    },
    { src: "/image 17 (1).svg", alt: "Insurance Network 5", carrier: "Aetna" },
    { src: "/cigna.svg", alt: "Insurance Network 5", carrier: "Cigna" },
    {
      src: "/image 6.svg",
      alt: "Insurance Network 1",
      carrier: "Kaiser Permanente",
    },
  ];
  const insuranceSecondLogos = [
    {
      src: "/HCSC.svg",
      alt: "Insurance Network 1",
      carrier: "The HSC Health Care System",
    },
    {
      src: "/BCBS.svg",
      alt: "Insurance Network 1",
      carrier: "Blue Cross Blue Shield",
    },
    {
      src: "/Highmark.svg",
      alt: "Insurance Network 1",
      carrier: "Highmark Blue Cross Blue Shield",
    },
    {
      src: "/centene.svg",
      alt: "Insurance Network 1",
      carrier: "Centennial Care",
    },
    { src: "/humana.svg", alt: "Insurance Network 4", carrier: "Humana" },
  ];
  const insuranceLeftLogos = [
    {
      src: "/image 6.svg",
      alt: "Insurance Network 1",
      carrier: "https://healthy.kaiserpermanente.org/front-door",
      insurance: "Kaiser Permanente",
    },
    {
      src: "/image 7.svg",
      alt: "Insurance Network 2",
      carrier: "https://www.anthem.com/",
      insurance: "Anthem Blue Cross",
    },
    {
      src: "/image 8.svg",
      alt: "Insurance Network 6",
      carrier: "https://www.blueshieldca.com/",
      insurance: "Anthem Blue Cross Blue Shield",
    },
    {
      src: "/image 9.svg",
      alt: "Insurance Network 4",
      carrier: "https://www.healthnet.com/content/healthnet/en_us.html",
      insurance: "BMC HealthNet Plan",
    },
    {
      src: "/image 17 (1).svg",
      alt: "Insurance Network 5",
      carrier: "https://www.aetna.com/",
      insurance: "Aetna",
    },
    {
      src: "/image 18.svg",
      alt: "Insurance Network 1",
      carrier: "https://example7.com",
      insurance: "UnitedHealthcare",
    },
  ];
  const insuranceRightLogos = [
    {
      src: "/image 6.svg",
      alt: "Insurance Network 1",
      carrier: "https://healthy.kaiserpermanente.org/front-door",
      insurance: "Kaiser Permanente",
    },
    {
      src: "/image 11.svg",
      alt: "Insurance Network 1",
      carrier: "https://example7.com",
      insurance: "Sutter Health Plus",
    },
    {
      src: "/image 12.svg",
      alt: "Insurance Network 2",
      carrier: "https://example8.com",
      insurance: "Stanford Health Care Advantage",
    },
    {
      src: "/image 13.svg",
      alt: "Insurance Network 3",
      carrier: "https://example9.com",
      insurance: "UCHP (University of Chicago Health Plan)",
    },
  ];
  useEffect(() => {
    const parsedFormData = JSON.parse(localStorage.getItem("formData"));
    const storedSpecialty = parsedFormData?.specialty;
    const storedInsurer = parsedFormData?.insurer;

    if (storedSpecialty) {
      const specialtyObj = medicalSpecialtiesOptions.find(
        (opt) => opt.value === storedSpecialty
      );
      if (specialtyObj) {
        setSelectedSpecialty(specialtyObj);
        formik.setFieldValue("specialty", specialtyObj.value);
      }
    }
    if (storedInsurer) {
      const insurerObj = insuranceCarrierOptions.find(
        (opt) => opt.value === storedInsurer
      );
      if (insurerObj) {
        setSelectedInsurer(insurerObj);
        formik.setFieldValue("insurer", insurerObj.value);
      }
    }
    fetchUserLocationAndPopularDrs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js-na2.hs-scripts.com/242621305.js";
    script.async = true;
    script.defer = true;
    script.id = "hs-script-loader";
    document.body.appendChild(script);
  }, []);
  // const getPopularDrs = async (lat, lng) => {
  //   //
  //   try {
  //     const data = {
  //       location: `${lat},${lng}`,
  //       radius: 20000,
  //       keyword: "Primary Care Physician",
  //       dont_fetch_distance: true,
  //     };
  //     const response = await axios.post(
  //       "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
  //       data
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching popular doctors:", error);
  //     return [];
  //   }
  // };
  const logNetworkInfo = async (ipaddress: string, logrequest: boolean) => {
    const default_ip = localStorage.getItem("ipAddress");
    try {
      const data = {
        device_category: "web",
        device_ip_address: ipaddress ?? default_ip,
      };
      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/patient-network-info",
        data
      );
      // console.log(response.data)
      const existingFormData = localStorage.getItem("formData");
      const parsedExistingData = JSON.parse(existingFormData);
      // Merge existing data with new values (new values take precedence)
      const mergedValues = {
        ...parsedExistingData,
        request_id: response.data.request_id,
      };
      localStorage.setItem("formData", JSON.stringify(mergedValues));
      if (logrequest) {
        logRequestInfo(response.data?.request_id);
      }
      return response.data?.request_id;
    } catch (error) {
      console.error("Error fetching popular doctors:", error);
      return [];
    }
  };

  const fetchUserLocationAndPopularDrs = async () => {
    const parsedFormData = JSON.parse(localStorage.getItem("formData"));
    const storedDoctors = localStorage.getItem("popularDoctors");
    const storedAddress = parsedFormData?.address || "";
    const storedLocation = localStorage.getItem("selectedLocation");
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
    getLocationFromIP();
  };
  // Function to get location from IP address
  const getLocationFromIP = async () => {
    console.log("fetching location from ip....");
    try {
      // Use IP-based geolocation as fallback
      const ipGeolocationResponse = await axios.get("https://ipapi.co/json/");
      if (
        ipGeolocationResponse.data &&
        ipGeolocationResponse.data.latitude &&
        ipGeolocationResponse.data.longitude
      ) {
        const lat = ipGeolocationResponse.data.latitude;
        const lng = ipGeolocationResponse.data.longitude;
        const city = ipGeolocationResponse.data.city;
        const ip_address = ipGeolocationResponse.data.ip;
        const region = ipGeolocationResponse.data.region;
        const country = ipGeolocationResponse.data.country_name;
        const formattedAddress = `${city}, ${region}, ${country}`;
        setSelectedLocation({ lat, lng });
        setAddressLocation(formattedAddress);
        localStorage.setItem("ipAddress", ip_address);
        updateAddressInStorage(formattedAddress);
        localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
        logNetworkInfo(ip_address);

        // const popularDoctors = await getPopularDrs(lat, lng);
        // if (popularDoctors?.results?.length > 0) {
        //   const doctorlists = popularDoctors?.results?.slice(0, 20);
        //   setpopulardoctors(doctorlists);
        //   localStorage.setItem("popularDoctors", JSON.stringify(doctorlists));
        // }
      } else {
        // IP geolocation failed, use default location
        toast.error(
          "Could not determine your location. Using default location."
        );
        // getDefaultLocation();
      }
    } catch (error) {
      console.error("Error with IP geolocation:", error);
      toast.error("Could not determine your location. Using default location.");
      //  getDefaultLocation();
    }
  };
  const logRequestInfo = async (request_id) => {
    const parsedFormData = JSON.parse(localStorage.getItem("formData"));
    const savedAddress = parsedFormData?.address;
    const ipAddress = localStorage.getItem("ipAddress");
    const data = {
      request_id,
      doctor_speciality: formik.values.specialty?.value ?? "",
      insurer: formik.values.insurer?.value ?? "",
      preferred_location: savedAddress,
    };
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-request-info-new`,
        data
      );
      return resp.data?.request_id;
    } catch (error) {
      return null;
    }
  };
  const formik = useFormik({
    initialValues: {
      specialty: prefilledSpecialty || { label: "", value: "" },
      insurer: selectedInsurer || { label: "", value: "" },
    },
    validationSchema,
    onSubmit: async (values) => {
      localStorage.removeItem("topReviewDoctors");
      localStorage.removeItem("topRatedDoctors");
      track("Homepage_Search_Btn_Clicked");
      if (
        values.specialty?.value === "unsure" ||
        values.specialty?.value === "Other"
      ) {
        router.push("/coming-soon");
        setGlobalLoading(false); // Turn off global loading if redirecting
        return;
      }
      setisLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        setGlobalLoading(false); // Turn off global loading if there's an error
        return;
      }
      if (!values.specialty) {
        checkPrefillAvailability();
        return;
      }
      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        updateSpecialtyInStorage(values.specialty?.value);
        updateInsuranceInStorage(values.insurer?.value);
        localStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty?.value })
        );

        // Call logRequestInfo without awaiting
        const requestIdPromise = logNetworkInfo(null, true);
        const speciality_value =
          formik.values.specialty?.value === "Prescription / Refill"
            ? "Primary Care Physician"
            : formik.values.specialty?.value;
        const data = {
          location: `${lat},${lng}`,
          radius: 20000,
          keyword: speciality_value,
        };
        const response = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
          data
        );
        console.log(data);
        // Handle request_id when the promise resolves
        requestIdPromise.then((request_id) => {
          if (request_id) {
            const updatedValues = { ...values, request_id };
            const existingFormData = localStorage.getItem("formData");
            let mergedValues = updatedValues;

            if (existingFormData) {
              try {
                const parsedExistingData = JSON.parse(existingFormData);
                // Merge existing data with new values (new values take precedence)
                mergedValues = { ...parsedExistingData, ...updatedValues };
              } catch (error) {
                console.error("Error parsing existing form data:", error);
              }
            }
            localStorage.setItem("formData", JSON.stringify(mergedValues));
            fetchAndLogDrLists(response.data, request_id);
          }
        });

        localStorage.setItem("statusData", JSON.stringify(response.data));
        localStorage.setItem("lastSearchSource", "home"); // Track last search source
        router.push("/search-doctor");
        // Note: We don't need to turn off global loading here as we're navigating away
      } catch (error) {
        console.error("Error submitting form:", error);
        setisLoading(false);
        setGlobalLoading(false); // Turn off global loading if there's an error
      }
    },
  });
  const logDrLists = async (data) => {
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-doctor-list`,
        data
      );
      return;
    } catch (error) {
      console.error("Error dr details:", error);
      return null;
    }
  };
  const fetchAndLogDrLists = async (drsData, request_id) => {
    if (drsData) {
      const payload = {
        request_id: request_id,
        ...drsData,
      };
      await logDrLists(payload);
    }
  };
  console.log(selectedSpecialty);
  console.log(formik.values);

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
      if (places?.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address; // Get formatted address

        setSelectedLocation({ lat, lng });
        setAddressLocation(formattedAddress); // Update input field state

        // Store in localStorage
        updateAddressInStorage(formattedAddress);
        localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
      }
    }
  };

  const PrefillLocation = (location: string) => {
    scrollToSection("home", 40);
    setAddressLocation(location);
  };
  console.log(selectedSpecialty);
  console.log(formik.values);

  return (
    <div className="min-h-screen w-full bg-[#FCF8F1]  my-section ">
      {/* Global Loading Spinner */}
      <GlobalSpinner isVisible={globalLoading} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50  text-sm nav-header">
        <div className="flex justify-between items-center gap-6 ">
          <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-28 h-auto md:flex cursor-pointer web"
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
            className="w-auto h-auto block cursor-pointer mobile"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              scrollToSection("home", 40); // Scroll to 'doctors' section with 80px offset
            }}
          />
          <div className="space-x-6 md:block web">
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

        <div className="hidden md:flex space-x-6 items-center web">
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
              router.push("/get-gift");
            }}
            className="text-white bg-[#0074BA] rounded-md"
          >
            <GiftIcon className="h-5 w-5" /> Get $100
          </Button>
        </div>

        <div className="flex space-x-4 mobile">
          <Button
            className="text-white bg-[#0074BA] rounded-md block text-xs "
            onClick={(e) => {
              e.preventDefault();
              router.push("/get-gift");
            }}
          >
            Get $100
          </Button>
          <button className="" onClick={() => setIsOpen(true)}>
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
      <main className="w-full overflow-x-hidden">
        <section
          id="home"
          className="md:h-screen h-auto md:pt-24 pt-36 flex flex-col items-center justify-center bg-[#FCF8F1]  border-b relative"
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
              // onSubmit={formik.handleSubmit}
              className="flex gap-2 w-full pt-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex flex-col md:flex-row w-full bg-white rounded-md border border-black">
                {/* Specialty and location inputs */}
                <div className="flex flex-col sm:flex-row flex-grow w-full">
                  {/* Specialty section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <LucideStethoscope className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1  border-gray-400 md:border-none">
                      <Select
                        id="specialty"
                        name="specialty"
                        styles={customStyles}
                        options={medicalSpecialtiesOptions}
                        placeholder="Medical specialty"
                        value={selectedSpecialty}
                        selected={formik.values.specialty}
                        onChange={(value) => {
                          formik.setFieldValue("specialty", value?.value);
                          setSelectedSpecialty(value); // ✅ set full object
                        }}
                        isClearable={true}
                        isSearchable={true}
                      />
                    </div>
                  </div>
                  {/* Insurer section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <BookText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 border-gray-400 md:border-none">
                      <Select
                        id="insurer"
                        name="insurer"
                        styles={customStyles}
                        options={insuranceCarrierOptions}
                        placeholder="Insurance carrier (optional)"
                        value={selectedInsurer}
                        selected={formik.values.insurer}
                        onChange={(value) => {
                          formik.setFieldValue("insurer", value?.value);
                          setSelectedInsurer(value);
                        }}
                        isClearable={true}
                        isSearchable={true}
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
                            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none text-ellipsis"
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
                    <Button
                      className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 my-4 h-12 items-center justify-center w-full md:w-auto md:hidden"
                      onClick={formik.handleSubmit} // Explicitly trigger form submission
                      type="submit"
                    >
                      {/* <Search className="w-5 h-5 text-white" /> Search */}
                      {isLoading && !globalLoading ? (
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
                  </div>
                </div>
              </div>
              <Button
                // disabled={
                //   isLoading || !formik.values.specialty || !selectedLocation
                // }
                onClick={formik.handleSubmit} // Explicitly trigger form submission
                type="submit"
                className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden"
              >
                {/* <Search className="w-5 h-5 text-white" /> Search */}
                {isLoading && !globalLoading ? (
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
            <ScrollArea className="w-full whitespace-nowrap md:flex gap-4 md:pt-4 pt-0">
              <div className="flex gap-4 px-1 pb-2 md:max-w-full justify-center">
                {doctorTypes.map((value, index) => (
                  <Button
                    key={index}
                    className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                      selectedSpecialty?.value === value.value
                        ? "bg-slate-800 text-white"
                        : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800"
                    }`}
                    onClick={() => {
                      const selected = medicalSpecialtiesOptions.find(
                        (opt) => opt.value === value.value
                      );
                      checkPrefillAvailability(selected?.value ?? "");
                      if (selected) {
                        setSelectedSpecialty(selected);
                        formik.setFieldValue("specialty", selected?.value);
                      }
                    }}
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
            {/* <div></div> */}

            {/* <Link
              href="/coming-soon"
              className="text-[#E5573F] md:flex space-x-2 mt-2 items-center hidden"
            >
              <p>Search for a doctor, hospital or medical group</p>
              <ArrowRight />
            </Link> */}
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

        <section id="about" className=" bg-white my-section">
          <div className="about_wrapper mx-auto py-[7%] px-[10px]">
            <AboutContentLeft
              scrollToSection={scrollToSection}
              updateprefillAvailability={checkPrefillAvailability}
              insuranceLeftLogos={insuranceLeftLogos}
              title="Find doctors in any insurance network"
              ImgDisplayFor="InsuranceNetwork"
            />
            <AboutContentRight
              scrollToSection={scrollToSection}
              updateprefillAvailability={checkPrefillAvailability}
              insuranceRightLogos={insuranceRightLogos}
              title="Find providers at top health systems"
            />
            <AboutContentLeft
              scrollToSection={scrollToSection}
              updateprefillAvailability={checkPrefillAvailability}
              title="Find doctors accepting new patients"
              subtitle="Same-day and last-minute appointments"
              ImgDisplayFor="NewPatient"
            />
          </div>
        </section>

        {/* md:px-44 */}
        <section
          id="how_it_works"
          className="flex bg-[#0074BA] border-b md:py-16 py-8 px-0 text-white my-section"
        >
          <div className="inner flex flex-col items-center justify-center gap-10 w-[85%] mx-auto">
            <h2 className="text-3xl ">How it works</h2>
            <p className="md:max-w-lg px-8 md:px-0 text-center">
              Skip the hassle of calling multiple doctor's offices. Our AI takes
              care of your scheduling needs.
            </p>

            <div className="flex flex-col  md:pt-4 pt-0 md:grid grid-cols-3 gap-8 lg:gap-12 md:w-[100%]">
              <div className="flex flex-col justify-between bg-[#0C679F] h-[245px] items-center rounded-xl px-8 pb-6  md:w-358 md:px-6 md:h-[auto] it_works_card">
                <div className="w-233">
                  <Image
                    src="/Group 189.svg"
                    alt="call Logo"
                    width={233}
                    height={320}
                    className="relative top-0 left-1/2 -translate-x-1/2 -translate-y-[10%]  h-auto max-w[100%]"
                  />
                </div>

                <div className="flex justify-center h-[46px] mb-4">
                  <p className="text-center text-sm lg:text-base basis-[180px]">
                    Enter your appointment details
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between bg-[#0C679F] h-[245px] items-center rounded-xl px-8 pb-6  md:w-358 md:px-6 md:h-[auto] it_works_card">
                <div className="w-233">
                  <Image
                    src="/Group 190.svg"
                    alt="call Logo"
                    // width={220}
                    width={233}
                    height={320}
                    className="relative top-0 left-1/2 -translate-x-1/2 -translate-y-[10%] h-auto max-w[100%]"
                  />
                </div>

                {/* Text Content */}
                <div className="flex justify-center mb-4">
                  <p className="text-center text-sm lg:text-base basis-[190px] md:basis-[215px]">
                    Our AI makes the calls and books the appointment
                  </p>
                </div>
              </div>{" "}
              <div className="flex flex-col bg-[#0C679F] items-center h-[245px] rounded-xl px-8 pb-6  md:w-358 md:px-6 md:h-[auto] it_works_card">
                <div className="w-233">
                  <Image
                    src="/Group 191.svg"
                    alt="call Logo"
                    width={233}
                    height={320}
                    className="relative top-0 left-1/2 -translate-x-1/2 -translate-y-[20%] max-w[100%] img-instant-confirm"
                  />
                </div>

                <div className="flex justify-center mb-4">
                  <p className="text-center text-sm lg:text-base basis-[180px]">
                    Receive instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section
          id="doctors"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 pb-16 px-0"
        >
          <h2 className="text-3xl md:px-44 mb-10 px-4 flex text-center">
            Top-rated doctors near me
          </h2>
          {/* 
          <DoctorCardCarousel
            doctors={populardoctors}
            checkPrefillAvailability={checkPrefillAvailability}
          />
        </section> */}

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
                  selectedSpecialty?.value === value.value
                    ? "bg-slate-800 text-white"
                    : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800"
                }`}
                onClick={() => {
                  const selected = medicalSpecialtiesOptions.find(
                    (opt) => opt.value === value.value
                  );
                  checkPrefillAvailability(selected?.value ?? "");
                  if (selected) {
                    setSelectedSpecialty(selected);
                    formik.setFieldValue("specialty", selected?.value);
                  }
                }}
              >
                {value.label}
              </Button>
            ))}
          </div>

          {/* Positioned Image Slightly Above Bottom with No Extra Space Below */}
          <div className="absolute bottom-[-90px] left-0 w-full flex justify-start pl-8 pointer-events-none">
            <Image
              src="/OBJECTS.svg"
              alt="Decorative Star"
              width={200}
              height={200}
              className="hidden md:block height-browser-icon"
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
                      formik.setFieldValue("insurer", logo?.carrier);
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
                      formik.setFieldValue("insurer", logo?.carrier);
                    }}
                    className="w-auto h-auto hidden md:flex cursor-pointer"
                  />
                ))}
              </div>
            </div>
            <Link
              onClick={(e) => {
                e.preventDefault();
                // scrollToSection("home", 40);
                checkPrefillAvailability();
              }}
              href=""
              className=" flex justify-center gap-1 pt-12 hover:text-gray-700"
            >
              Get Started <ArrowRight />
            </Link>
          </div>

          <div className="w-[100%] md:w-[80%]">
            <HealthConcerns
              onClickAction={(speciality: string) => {
                scrollToSection("home", 40);
                handleDoctorTypeClick(speciality);
              }}
            />
          </div>
        </section>

        {/* Footer Section */}
        <FooterSection />
      </main>
    </div>
  );
}
