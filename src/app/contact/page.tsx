// "use client";
// import Navbar from "@/components/general-components/navbar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
// import axios from "axios";
// import { useFormik } from "formik";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useRef, useState } from "react";
// import * as Yup from "yup";

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
// });
// export default function Contact() {
//   const [formData, setFormData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [addressLocation, setAddressLocation] = useState(null);
//   const router = useRouter();
//   const addressRefs = useRef([]);
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     const storedData =  window.sessionStorage.getItem("formData");
//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       setFormData(parsedData);
//       console.log("Retrieved formData:", parsedData);
//     } else {
//       console.warn("No form data found in  window.sessionStorage.");
//     }

//     // Retrieve searchData
//     const storedSearchData =  window.sessionStorage.getItem("searchData");
//     if (storedSearchData) {
//       const parsedSearchData = JSON.parse(storedSearchData);
//       console.log("Retrieved searchData:", parsedSearchData);
//     } else {
//       console.warn("No searchData found in  window.sessionStorage.");
//     }
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       patientName: "",
//       phoneNumber: "",
//       email: "",
//       patientHistory: "",
//       objective: "",
//       specialty: "",
//       groupId: "",
//       subscriberId: "",
//       insurer: "",
//       zipcode: "",
//       dob: "",
//       address: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       console.log("here", values);

//       const updatedValues = {
//         ...values,
//       };
//       console.log(updatedValues);
//       // setIsLoading(true);
//       // if (!selectedLocation) {
//       //   toast.error("No location selected");
//       //   return;
//       // }

//       // Ensure searchData is not null
//       if (!searchData) {
//         console.warn(
//           "searchData is null, ensuring it's set correctly before navigating."
//         );
//       }
//       try {
//         const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
//         const response = await axios.get(
//           `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
//         );

//          window.sessionStorage.setItem("formData", JSON.stringify(updatedValues));
//          window.sessionStorage.setItem("statusData", JSON.stringify(response.data));

//         // console.log("Form Data:", values);
//         // console.log("API Response Data:", response.data);
//         // Navigate to status page
//         router.push("/transcript");
//       } catch (error) {
//         console.error("Error submitting form:", error);
//       }
//     },
//   });

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
//   return (
//     <>
//       <Navbar />
//       <form
//         onSubmit={formik.handleSubmit}
//         className="h-screen flex flex-col justify-center items-center px-6 sm:px-10"
//       >
//         <div className="w-full max-w-lg   p-6 sm:p-10 rounded-lg">
//           <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
//             One Last Step
//           </p>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label>Patient name</Label>
//               <Input
//                 className="rounded-none"
//                 name="patientName"
//                 onChange={formik.handleChange}
//                 value={formik.values.patientName}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Date of Birth</Label>
//               <Input
//                 className="rounded-none"
//                 id="dob-id"
//                 name="dob"
//                 onChange={formik.handleChange}
//                 value={formik.values.dob}
//               />
//             </div>
//             <div className="space-y-2">
//               {/* <Label>Address</Label>
//               <Input className="rounded-none"></Input> */}
//               <div className="flex flex-col space-y-4">
//                 <Label htmlFor="address" className=" w-auto  font-semibold ">
//                   Address
//                 </Label>
//                 {isLoaded && (
//                   <StandaloneSearchBox
//                     onLoad={(ref) => (addressRefs.current[0] = ref)}
//                     onPlacesChanged={() => handleOnAddressChanged(0)}
//                   >
//                     <Input
//                       className="rounded-none"
//                       placeholder="Search address.."
//                     />
//                   </StandaloneSearchBox>
//                 )}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Email address</Label>
//               <Input
//                 name="email"
//                 placeholder=""
//                 onChange={formik.handleChange}
//                 value={formik.values.email}
//                 className={
//                   formik.errors.email && formik.touched.email
//                     ? "border-red-500"
//                     : " rounded-none"
//                 }
//               />
//               {formik.errors.email && formik.touched.email && (
//                 <div className="text-red-500">{formik.errors.email}</div>
//               )}
//             </div>
//           </div>

//           <span className="text-sm text-gray-600 block pt-2 ">
//             Appointment details will be sent to this email.
//           </span>
//           <span className="text-xs  block pt-8  text-[#FF6723]">
//             By continuing, you authorize us to book an appointment on your
//             behalf.
//           </span>

//           <div className="flex justify-center mt-12">
//             <Button
//               type="submit"
//               className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto "
//             >
//               Continue
//             </Button>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }
// @ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function Contact() {
  const [formData, setFormData] = useState({});
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const router = useRouter();
  const addressRefs = useRef([]);

  const wsRef = useRef<WebSocket | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);
  const [activeCallIndex, setActiveCallIndex] = useState(0);
  const activeCallIndexRef = useRef(activeCallIndex);
  const [context, setcontext] = useState("");
  useEffect(() => {
    activeCallIndexRef.current = activeCallIndex;
  }, [activeCallIndex]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  useEffect(() => {
    const storedFormData =  window.sessionStorage.getItem("formData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }

    const storedSearchData =  window.sessionStorage.getItem("searchData");
    if (storedSearchData) {
      setSearchData(JSON.parse(storedSearchData));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      patientName: formData.patientName || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      patientHistory: formData.patientHistory || "",
      objective: formData.objective || "",
      specialty: formData.specialty || "",
      groupId: formData.groupId || "",
      subscriberId: formData.subscriberId || "",
      insurer: formData.insurer || "",
      zipcode: formData.zipcode || "",
      dob: formData.dob || "",
      address: formData.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      //console.log(values);
      setIsLoading(true);

      const updatedFormData = {
        ...formData, // Preserve existing data
        ...values, // Add new values
        address: values.address || formData.address, // Keep existing address if unchanged
      };
      //console.log("got here", values);
      console.log(updatedFormData);
      // try {
      //   // const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
      //   // const response = await axios.get(
      //   //   `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
      //   // );

      //    window.sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
      //    window.sessionStorage.setItem("statusData", JSON.stringify(response.data));

      //   router.push("/transcript");
      // } catch (error) {
      //   console.error("Error submitting form:", error);
      // } finally {
      //   setIsLoading(false);
      // }
      try {
         window.sessionStorage.setItem("formData", JSON.stringify(updatedFormData));

        router.push("/transcript?confirmed=true"); // Redirect immediately after confirming
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleOnAddressChanged = (index) => {
    if (addressRefs.current[index]) {
      const places = addressRefs.current[index].getPlaces();
      if (places && places.length > 0) {
        const address = places[0];
        formik.setFieldValue("address", address?.formatted_address);
        setSelectedLocation({
          lat: address.geometry.location.lat(),
          lng: address.geometry.location.lng(),
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={formik.handleSubmit}
        className="h-screen flex flex-col justify-center items-center px-6 sm:px-10"
      >
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            One Last Step
          </p>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Patient name</Label>
              <Input
                className="rounded-none"
                name="patientName"
                onChange={formik.handleChange}
                value={formik.values.patientName}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                className="rounded-none"
                name="dob"
                onChange={formik.handleChange}
                value={formik.values.dob}
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="address" className="w-auto font-semibold">
                  Address
                </Label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (addressRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnAddressChanged(0)}
                  >
                    <Input
                      className="rounded-none w-full"
                      placeholder="Search address.."
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      name="address"
                    />
                  </StandaloneSearchBox>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : "rounded-none"
                }
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <span className="text-sm text-gray-600 block pt-2">
            Appointment details will be sent to this email.
          </span>
          <span className="text-xs block pt-8 text-[#FF6723]">
            By continuing, you authorize us to book an appointment on your
            behalf.
          </span>

          <div className="flex justify-center mt-12">
            <Button
              type="submit"
              className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Continue"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
