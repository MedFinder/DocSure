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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { track } from "@vercel/analytics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { trackConversion } from "@/lib/gtag";

// Validation schema remains the same - all fields required
const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  address: Yup.string().required("Address is required"),
});
const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non-binary", label: "Non-binary" },
];
export default function Contact() {
  const [formData, setFormData] = useState({});
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [gender, setgender] = useState("");
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
    if (typeof window !== "undefined") {
     //  window.gtag('config', 'AW-10808779518');
      const storedFormData = sessionStorage.getItem("formData");
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }

      const storedSearchData = sessionStorage.getItem("searchData");
      if (storedSearchData) {
        setSearchData(JSON.parse(storedSearchData));
      }
    }
    // trackConversion('conversion', {
    //   label: 'FrmFCKr6g64aEP7Fg6Io', // Optional, from Google Ads
    //   'value': 2.0,
    //   'currency': 'USD'
    // });
  }, []);
  // Utility function to format date without timezone issues
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    // getMonth() is zero-based, so add 1
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formik = useFormik({
    initialValues: {
      patientName: formData.patientName || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      address: formData.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("ContactPage_Btn_Clicked");
      // trackConversion('conversion', {
      //   label: 'FrmFCKr6g64aEP7Fg6Io', // Optional, from Google Ads
      //   'value': 2.0,
      //   'currency': 'USD'
      // });

      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }

      setIsLoading(true); // Show spinner
      const updatedFormData = {
        ...formData,
        ...values,
        dob: formatDateToYYYYMMDD(values.dob),
        gender,
        address: values.address || formData.address,
      };

      try {
        // Simulate a 1-second delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        window.sessionStorage.setItem(
          "formData",
          JSON.stringify(updatedFormData)
        );

        router.push("/transcript?confirmed=true"); // Redirect after delay
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false); // Hide spinner
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Force validation of all fields on submission attempt
  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to show errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Then submit if valid
    formik.handleSubmit(e);
  };

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
  // Custom handler for date picker
  const handleDateChange = (date) => {
    formik.setFieldValue("dob", date);
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center px-6 sm:px-10 mt-32 md:mt-16"
      >
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            One Last Step
          </p>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Patient name</Label>
              <Input
                className={
                  formik.errors.patientName && formik.touched.patientName
                    ? "border-red-500 rounded-none"
                    : "rounded-none"
                }
                name="patientName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.patientName}
              />
              {formik.errors.patientName && formik.touched.patientName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.patientName}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date of Birth </Label>
              <div className="w-full">
                <DatePicker
                  selected={formik.values.dob}
                  onChange={handleDateChange}
                  onBlur={formik.handleBlur}
                  dateFormat="yyyy-MM-dd"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={new Date()}
                  autoComplete="off"
                  aria-autocomplete="none"
                  // placeholderText="Select date of birth"
                  name="dob"
                  className={`w-full p-2 border ${
                    formik.errors.dob && formik.touched.dob
                      ? "border-red-500 rounded-none"
                      : "border-input rounded-none"
                  }`}
                  wrapperClassName="w-full"
                />
              </div>
              {formik.errors.dob && formik.touched.dob && (
                <div className="text-red-500 text-sm">{formik.errors.dob}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                name="gender"
                value={gender}
                onValueChange={(value) => setgender(value)}
                className="flex flex-row gap-4"
              >
                {genderOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={option.value} value={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="address" className="w-auto ">
                  Address
                </Label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (addressRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnAddressChanged(0)}
                  >
                    <Input
                      className={
                        formik.errors.address && formik.touched.address
                          ? "border-red-500 rounded-none"
                          : "rounded-none"
                      }
                      placeholder="Search address.."
                      value={formik.values.address}
                      onChange={(e) => {
                        formik.handleChange(e);
                        // Let the user type a custom address if they want
                      }}
                      onBlur={formik.handleBlur}
                      name="address"
                    />
                  </StandaloneSearchBox>
                )}
                {formik.errors.address && formik.touched.address && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.address}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={
                  formik.errors.email && formik.touched.email
                    ? "border-red-500 rounded-none"
                    : "rounded-none"
                }
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Phone number</Label>
              <Input
                name="phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                className={
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                    ? "border-red-500 rounded-none"
                    : "rounded-none"
                }
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <span className="text-sm text-gray-600 block pt-2">
            Appointment details will be sent to this phone number.
          </span>
          <span className="text-xs block pt-8 text-[#FF6723]">
            By continuing, you authorize us to book an appointment on your
            behalf.
          </span>

          <div className="flex justify-center md:mt-12 mt-6">
            <Button
              type="submit"
              className="bg-[#FF6723] text-white px-6 py-5 w-full sm:w-auto flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="px-6">
                  <Loader2 className="animate-spin w-5 h-5" />
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
