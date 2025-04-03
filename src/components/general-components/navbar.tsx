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
      track("Navbar_Search_Btn_Clicked");
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
        const speciality_value = formik.values.specialty === 'Prescription / Refill' ? 'Primary Care Physician (PCP) / Family Practice Physician' : formik.values.specialty;
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${speciality_value}`
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
      <div className="flex justify-between py-5 md:px-8 px-5 relative md:border-none   border border-b-2 items-center">
        {/* {pathname === "/" && ( */}
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
                {/* Input Fields - Stack on mobile */}
                <div className="flex flex-col md:flex-row flex-grow w-full">
                  {/* Specialty Section */}
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

                  {/* Location Section */}
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

                {/* Search Button - Stays on the right, filling height on mobile */}
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
        {/* )} */}

        {/* Left Section: Logo & Search (only on Search Page) */}

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-md font-normal">
          <Link
            onClick={() => track("Help_Btn_Clicked")}
            href="/contact-us"
            className="hover:text-gray-500"
          >
            Help
          </Link>
        </div>
        {/* Mobile Hamburger */}
        {pathname == "/" && (
          <div className="md:hidden flex gap-8 items-center text-md font-normal ">
            <Link href="/contact-us" className="hover:text-gray-500">
              Help
            </Link>
          </div>
        )}

        {/* add it back here?? */}

        {/* {pathname !== "/" && (

          <button onClick={toggleSidebar} className="md:hidden">

            <Menu className="w-8 h-8 text-gray-700" />

          </button>

        )} */}
      </div>

      {/* Mobile Sidebar */}

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 md:hidden flex">
          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent sidebar clicks from closing it
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
              {/* Ensure links don't close the sidebar unless explicitly intended */}
              <Link
                href="/contact-us"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent sidebar from closing
                  router.push("/contact-us"); // Navigate to page
                }}
                className="hover:text-gray-500"
              >
                Help
              </Link>
            </nav>
          </div>

          {/* Overlay (clicking outside will close sidebar) */}
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={closeSidebar} // Clicks outside sidebar close it
          />
        </div>
      )}
    </div>
  );
}

// {pathname !== "/" && (
//   //mobile form  come back for it

//   <div className=" md:hidden  items-center w-full gap-4">
//     <form
//       onSubmit={formik.handleSubmit}
//       className=" flex w-full max-w-[50rem] border border-gray-600 rounded-md shadow-sm items-center"
//     >
//       {/* Input Sections (Stacked on top of each other in mobile, inline in desktop) */}

//       <div className="flex flex-col w-full md:flex-row md:items-center md:space-x-2 flex-grow">
//         {/* Specialty section */}

//         <div className="flex items-center bg-white border overflow-hidden flex-1">
//           <Search className="w-4 h-4 text-gray-500 mx-2" />

//           <Autocomplete
//             id="specialty"
//             name="specialty"
//             className="w-full text-sm"
//             options={medicalSpecialtiesOptions}
//             placeholder="Medical specialty"
//             selected={specialty}
//             onChange={(value) => {
//               setSpecialty(value);

//               formik.setFieldValue("specialty", value);
//             }}
//             clearable={false}
//             navbar
//           />
//         </div>

//         {/* Location section */}

//         <div className="flex items-center bg-white border overflow-hidden flex-1">
//           <MapPin className="w-4 h-4 text-gray-500 mx-2" />

//           {isLoaded && (
//             <StandaloneSearchBox
//               onLoad={(ref) => (inputRefs.current[0] = ref)}
//               onPlacesChanged={() => handleOnPlacesChanged(0)}
//             >
//               <Input
//                 type="text"
//                 placeholder="Address, city, zip code"
//                 className="w-full text-sm border-none focus:ring-0 focus:outline-none px-2"
//                 value={addressLocation || ""}
//                 onChange={(e) => setAddressLocation(e.target.value)}
//                 autoComplete="off"
//                 aria-autocomplete="none"
//               />
//             </StandaloneSearchBox>
//           )}
//         </div>
//       </div>

//       {/* Search Button (Expands to fill space) */}

//       <Button className="bg-[#FF6723] text-white h-full flex-1 py-9 flex items-center justify-center">
//         <Search className="text-white w-5 h-5" />
//       </Button>
//     </form>
//   </div>
// )}

//update one

// {pathname !== "/" && (
//   <form
//     onSubmit={formik.handleSubmit}
//     className="flex w-full max-w-[50rem] border border-gray-600 rounded-none shadow-sm "
//   >
//     <div className="flex flex-grow items-center w-full">
//       {/* Specialty section */}
//       <div className="flex items-center flex-1">
//         <div className="flex items-center justify-center px-3">
//           <Search className="w-5 h-5 text-gray-500" />
//         </div>
//         <div className="flex-1 min-w-[180px]">
//           <Autocomplete
//             id="specialty"
//             name="specialty"
//             className="w-full"
//             options={medicalSpecialtiesOptions}
//             placeholder="Medical specialty"
//             selected={specialty}
//             onChange={(value) => {
//               setSpecialty(value);
//               formik.setFieldValue("specialty", value);
//             }}
//             clearable={false}
//             navbar
//           />
//         </div>
//       </div>

//       {/* Location section */}
//       <div className="flex items-center flex-1">
//         <div className="flex items-center justify-center px-3">
//           <MapPin className="w-5 h-5 text-gray-500" />
//         </div>
//         <div className="flex-1">
//           {isLoaded && (
//             <StandaloneSearchBox
//               onLoad={(ref) => (inputRefs.current[0] = ref)}
//               onPlacesChanged={() => handleOnPlacesChanged(0)}
//             >
//               <Input
//                 type="text"
//                 placeholder="Address, city, zip code"
//                 className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
//                 value={addressLocation || ""}
//                 onChange={(e) => setAddressLocation(e.target.value)}
//                 autoComplete="off"
//                 aria-autocomplete="none"
//               />
//             </StandaloneSearchBox>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Search Button - Properly aligned */}
//     <Button className="bg-[#FF6723] text-white rounded-none h-12 px-6 flex-shrink-0">
//       <Search className="text-white w-5 h-5" />
//     </Button>
//   </form>
// )}

//@ts-nocheck
// "use client";
// import Navbar from "@/components/general-components/navbar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useRef, useState } from "react";
// import { useFormik } from "formik";
// import { track } from "@vercel/analytics";
// import * as Yup from "yup";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   StandaloneSearchBox,
// } from "@react-google-maps/api";
// import axios from "axios";
// import { toast } from "sonner";
// import { Combobox } from "@/components/ui/combo-box";
// import { medicalSpecialtiesOptions } from "@/constants/store-constants";
// import { Autocomplete } from "../../../components/ui/autocomplete";

// const doctorTypes = [
//   { value: "Dermatologist", label: "Dermatologist" },
//   {
//     value: "Cardiologist / Heart Doctor",
//     label: "Cardiologist / Heart Doctor",
//   },
//   {
//     value: "Neurologist / Headache Specialist",
//     label: "Neurologist / Headache Specialist",
//   },
//   { value: "Pediatrician", label: "Pediatrician" },
//   { value: "Dentist", label: "Dentist" },
//   { value: "Psychiatrist", label: "Psychiatrist" },
//   { value: "Ophthalmologist", label: "Ophthalmologist" },
//   {
//     value: "Orthopedic Surgeon / Orthopedist",
//     label: "Orthopedic Surgeon / Orthopedist",
//   },
// ];
// const validationSchema = Yup.object().shape({
//   specialty: Yup.string().required("Specialty is required"), // Ensure specialty is required
// });

// export default function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedAvailability, setSelectedAvailability] = useState("anytime");
//   const [timeOfAppointment, settimeOfAppointment] = useState("soonest");
//   const [isnewPatient, setisnewPatient] = useState("yes");
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [addressLocation, setAddressLocation] = useState(null);
//   const [isLoading, setisLoading] = useState(false);
//   const inputRefs = useRef([]);
//   const addressRefs = useRef([]);
//   const [selectedOption, setSelectedOption] = useState("no");
//   const [selectedDoctorType, setSelectedDoctorType] = useState(""); // Add this state to track selected button
//   const [prefilledAddress, setPrefilledAddress] = useState(""); // State for prefilled address
//   const [prefilledSpecialty, setPrefilledSpecialty] = useState(""); // State for prefilled specialty
//   const [doctors, setDoctors] = useState([]);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
//     libraries: ["places"],
//   });

//   // const handleOnPlacesChanged = (index) => {
//   //   if (inputRefs.current[index]) {
//   //     const places = inputRefs.current[index].getPlaces();
//   //     if (places.length > 0) {
//   //       const place = places[0];
//   //       const lat = place.geometry.location.lat();
//   //       const lng = place.geometry.location.lng();

//   //       setSelectedLocation({ lat, lng });
//   //     }
//   //     const placesNames = places.formatted_address;
//   //   }
//   // };
//   useEffect(() => {
//     const address = searchParams.get("address");
//     const specialty = searchParams.get("specialty");

//     if (address) {
//       setPrefilledAddress(address);
//       sessionStorage.setItem("selectedAddress", address);
//       setAddressLocation(address); // Set the address location for input field
//     }
//     if (specialty) {
//       setPrefilledSpecialty(specialty);
//       sessionStorage.setItem("selectedSpecialty", specialty);
//     }

//     // Retrieve lat/lng if available
// const savedLocation = sessionStorage.getItem("selectedLocation");
// if (savedLocation) {
//   setSelectedLocation(JSON.parse(savedLocation));
// }
//   }, [searchParams]);

//   // const handleOnPlacesChanged = (index) => {
//   //   if (inputRefs.current[index]) {
//   //     const places = inputRefs.current[index].getPlaces();
//   //     if (places.length > 0) {
//   //       const place = places[0];
//   //       const lat = place.geometry.location.lat();
//   //       const lng = place.geometry.location.lng();
//   //       const formattedAddress = place.formatted_address; // Get formatted address

//   //       // Set selected location state (if needed)
//   //       setSelectedLocation({ lat, lng });

//   //       // Store formatted address separately in sessionStorage
//   //       sessionStorage.setItem("selectedAddress", formattedAddress);

//   //       // Store lat/lng in sessionStorage
//   //       sessionStorage.setItem(
//   //         "selectedLocation",
//   //         JSON.stringify({ lat, lng })
//   //       );

//   //       console.log("Formatted Address Stored:", formattedAddress);
//   //     }
//   //   }
//   // };
//   const handleOnPlacesChanged = (index) => {
//     if (inputRefs.current[index]) {
//       const places = inputRefs.current[index].getPlaces();
//       if (places.length > 0) {
//         const place = places[0];
//         const lat = place.geometry.location.lat();
//         const lng = place.geometry.location.lng();
//         const formattedAddress = place.formatted_address; // Get formatted address

//         setSelectedLocation({ lat, lng });
//         setAddressLocation(formattedAddress); // Update input field state

//         // Store in sessionStorage
//         sessionStorage.setItem("selectedAddress", formattedAddress);
//         sessionStorage.setItem(
//           "selectedLocation",
//           JSON.stringify({ lat, lng })
//         );
//       }
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       specialty: prefilledSpecialty || "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       track("Homepage_Search_Btn_Clicked");
//       console.log(values);
//       const updatedValues = { ...values };

//       setisLoading(true);
//       if (!selectedLocation) {
//         toast.error("No location selected");
//         return;
//       }

//       try {
//         const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
//         console.log(lat, lng);
//         sessionStorage.setItem("selectedSpecialty", values.specialty);
//         // sessionStorage.setItem(
//         //   "selectedLocation",
//         //   JSON.stringify({ lat, lng })
//         // );
//         sessionStorage.setItem(
//           "searchData",
//           JSON.stringify({ lat, lng, specialty: values.specialty })
//         );
//         const response = await axios.get(
//           `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
//         );

//         sessionStorage.setItem("formData", JSON.stringify(updatedValues));
//         sessionStorage.setItem("statusData", JSON.stringify(response.data));
//         sessionStorage.setItem("lastSearchSource", "home"); // Track last search source

//         router.push("/search");
//       } catch (error) {
//         console.error("Error submitting form:", error);
//       }
//     },
//   });

//   // useEffect(() => {
//   //   if (selectedOption === "no") {
//   //     formik.setFieldValue("subscriberId", "");
//   //     formik.setFieldValue("groupId", "");
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [selectedOption]);

//   const handleOnAddressChanged = (index) => {
//     if (addressRefs.current[index]) {
//       const places = addressRefs.current[index].getPlaces();
//       if (places && places.length > 0) {
//         // <-- Added defensive check
//         const address = places[0];
//         //console.log(address)
//         formik.setFieldValue("address", address?.formatted_address);
//       }
//     }
//   };

//   function handleCreateOptions() {
//     return null;
//   }
//   const handleDoctorTypeClick = (type) => {
//     formik.setFieldValue("specialty", type);
//     setSelectedDoctorType(type); // Update selected doctor type
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="h-screen flex flex-col items-center justify-center md:px-6 px-0 ">
//         {/* Centered Main Content */}
//         <div className="text-start items-center space-y-4 w-full px-6 sm:px-20 lg:px-40   md:mt-0">
//           <p className="text-4xl sm:text-5xl text-left mb-8 text-[#333333]  font-medium md:font-normal">
//             Book top rated doctors near me
//           </p>

//           {/* Combined Search Input - Improved Responsive Layout */}
//           <form
//             onSubmit={formik.handleSubmit}
//             className="w-full border border-gray-500 rounded-none shadow-sm md:mb-0 "
//           >
//             <div className="flex flex-col md:flex-row w-full">
//               {/* Container for specialty and location inputs */}
//               <div className="flex flex-col sm:flex-row flex-grow w-full ">
//                 {/* Specialty section */}
//                 <div className="flex items-center w-full sm:w-auto sm:flex-1 ">
//                   <div className="flex items-center justify-center px-3 ">
//                     <Search className="w-5 h-5 text-gray-500" />
//                   </div>
//                   <div className="flex-1 border-b border-gray-400 md:border-none">
//                     <Autocomplete
//                       id="specialty"
//                       name="specialty"
//                       className="w-full"
//                       options={medicalSpecialtiesOptions}
//                       placeholder="Medical specialty"
//                       selected={formik.values.specialty}
//                       onChange={(value) => {
//                         formik.setFieldValue("specialty", value);
//                         setSelectedDoctorType("");
//                       }}
//                       clearable={false}
//                     />
//                   </div>
//                 </div>

//                 {/* Location section */}
//                 <div className="flex items-center w-full sm:flex-1">
//                   <div className="flex items-center justify-center px-3 h-full">
//                     <MapPin className="w-5 h-5 text-gray-500" />
//                   </div>
//                   <div className="flex-1">
//                     {isLoaded && (
//                       <StandaloneSearchBox
//                         onLoad={(ref) => (inputRefs.current[0] = ref)}
//                         onPlacesChanged={() => handleOnPlacesChanged(0)}
//                       >
//                         <Input
//                           type="text"
//                           placeholder="Address, city, zip code"
//                           className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
//                           value={addressLocation || ""}
//                           onChange={(e) => setAddressLocation(e.target.value)}
//                           autoComplete="off"
//                           aria-autocomplete="none"
//                         />
//                       </StandaloneSearchBox>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Search Button */}
//               <Button
//                 disabled={
//                   isLoading || !formik.values.specialty || !selectedLocation
//                 }
//                 className="bg-[#FF6723] text-white rounded-none px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden"
//               >
//                 {isLoading ? (
//                   <Loader2 className="w-5 h-5 text-white animate-spin" />
//                 ) : (
//                   <Search className="w-5 h-5 text-white" />
//                 )}
//               </Button>
//             </div>
//           </form>
//           <div className="pt-4">
//             {" "}
//             <Button
//               type="button" // Prevents default form submission behavior since it's outside the form
//               onClick={formik.handleSubmit} // Explicitly trigger form submission
//               disabled={
//                 isLoading || !formik.values.specialty || !selectedLocation
//               }
//               className="bg-[#FF6723] text-white rounded-none px-6 h-12  flex items-center justify-center w-full md:w-auto md:hidden"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 text-white animate-spin" />
//               ) : (
//                 <div className="flex gap-2 text-white items-center ">
//                   <Search className="w-5 h-5" />
//                   <p>Search</p>
//                 </div>
//               )}
//             </Button>
//           </div>

//           {/* Top Searches Section */}
//           {/* <div className="flex flex-col gap-4 pt-4">
//             <span className="text-xs text-gray-900 ">Top searches</span>
//             <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
//               {doctorTypes.map((value, index) => (
//                 <Button
//                   key={index}
//                   className={`rounded-full text-xs px-3 py-2 w-full sm:w-auto ${
//                     selectedDoctorType === value.value ||
//                     formik.values.specialty === value.value
//                       ? "bg-slate-800 text-white" // Selected state
//                       : "bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800" // Normal state
//                   }`}
//                   onClick={() => handleDoctorTypeClick(value.value)}
//                 >
//                   {value.label}
//                 </Button>
//               ))}
//             </div>
//           </div> */}
//           <div className="flex flex-col gap-4 md:pt-4 pt-0">
//             <span className="text-xs text-gray-900">Top searches</span>
//             <div className="sm:flex-wrap sm:gap-3 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 pb-2">
//               {doctorTypes.map((value, index) => (
//                 <Button
//                   key={index}
//                   className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
//                     selectedDoctorType === value.value ||
//                     formik.values.specialty === value.value
//                       ? "bg-slate-800 text-white" // Selected state
//                       : "bg-[#EFF2F4] text-[#595959] hover:text-white hover:bg-slate-800" // Normal state
//                   }`}
//                   onClick={() => handleDoctorTypeClick(value.value)}
//                 >
//                   {value.label}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* ...existing code... */}
//         </div>
//       </div>
//     </>
//   );
// }
