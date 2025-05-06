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
import { request } from "http";
import NavbarSection from "@/components/general-components/navbar-section";
import FooterSection from "../landing/components/FooterSection";

// Custom styles for DatePicker
const customDatePickerStyles = `
  .date-picker-error .react-datepicker__input-container input {
    border-color: #ef4444 !important; /* red-500 */
  }
`;

// Updated validation schema to include gender
const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  // email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  address: Yup.string().required("Address is required"),
  gender: Yup.string().required("Please select a gender"),
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
  const [genderTouched, setGenderTouched] = useState(false);
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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormData = localStorage.getItem("formData");
      if (storedFormData) {
        const parsedFormData = JSON.parse(storedFormData);
        setFormData(parsedFormData);

        // Prefill formik values
        formik.setValues({
          patientName: parsedFormData.patientName || "",
          phoneNumber: parsedFormData.phoneNumber || "",
          email: parsedFormData.email || "",
          address: parsedFormData.address || "",
          dob: parsedFormData.dob ? new Date(parsedFormData.dob) : null,
          gender: parsedFormData.gender || "",
        });
        setgender(parsedFormData.gender || "");

        // Revalidate the form and mark fields as touched
        formik.validateForm();
      }

      const storedSearchData = localStorage.getItem("searchData");
      if (storedSearchData) {
        setSearchData(JSON.parse(storedSearchData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Utility function to format date without timezone issues
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    // getMonth() is zero-based, so add 1
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const logPatientData = async (formData) => {
    const data = {
      request_id: formData.request_id,
      patient_name: formData.patientName,
      patient_dob: formData.dob,
      patient_email: formData.email,
      patient_number: formData.phoneNumber,
      patient_zipcode: "",
    };
    // console.log(data)
    try {
      const resp = await axios.put(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-patientdata/${formData.request_id}`,
        data
      );
      // console.log(resp)
      return;
    } catch (error) {
      // console.error('Error logging call details:', error);
      return null;
    }
  };

  const formik = useFormik({
    initialValues: {
      patientName: formData.patientName || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      address: formData.address || "",
      dob: formData.dob ? new Date(formData.dob) : null, // Initialize with null or parsed date
      gender: formData.gender || "", // Add gender to formik values
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
        gender: values.gender,
        address: values.address || formData.address,
      };
      logPatientData(updatedFormData);
      try {
        // Simulate a 1-second delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        window.localStorage.setItem(
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

  // Update handleSubmit to include gender touch
  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to show errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    // Set gender as touched
    setGenderTouched(true);

    // Validate all fields
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0 && gender) {
        formik.handleSubmit(e);
      } else {
        // Force re-render to show all validation errors
        if (!gender) {
          formik.setFieldError("gender", "Please select a gender");
        }
        formik.setErrors(errors);
      }
    });
  };

  // Update gender handler to set formik value too
  const handleGenderChange = (value) => {
    setgender(value);
    formik.setFieldValue("gender", value);
    if (!genderTouched) {
      setGenderTouched(true);
    }
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
    formik.setFieldTouched("dob", true); // Mark as touched when changed
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      formik.setFieldValue("address", savedAddress);
    }
  }, []);

  return (
    <>
      <NavbarSection />
      {/* Add style tag for custom DatePicker styling */}
      <style jsx global>
        {customDatePickerStyles}
      </style>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center md:px-6 sm:px-10 mt-40 md:mt-16"
      >
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            One Last Step
          </p>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#333333BF] text-sm ">Patient name</Label>
              <Input
                className={
                  formik.errors.patientName && formik.touched.patientName
                    ? "border-red-500 rounded-none"
                    : "border border-[#333333] rounded-md"
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
              <Label className="text-[#333333BF] text-sm space-y-2">
                Date of Birth{" "}
              </Label>
              <div
                className={`w-full ${
                  formik.errors.dob && formik.touched.dob
                    ? "date-picker-error"
                    : ""
                }`}
              >
                <DatePicker
                  selected={formik.values.dob}
                  onChange={handleDateChange}
                  onBlur={formik.handleBlur}
                  dateFormat="MM/dd/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={new Date()}
                  autoComplete="off"
                  aria-autocomplete="none"
                  name="dob"
                  className="w-full p-2 border border-[#333333] rounded-md"
                  wrapperClassName="w-full"
                />
              </div>
              {formik.errors.dob && formik.touched.dob && (
                <div className="text-red-500 text-sm">{formik.errors.dob}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-[#333333BF] text-sm">Gender</Label>
              <RadioGroup
                name="gender"
                value={gender}
                onValueChange={handleGenderChange}
                className="flex flex-row gap-4"
              >
                {genderOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={option.value} value={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {genderTouched && !gender && (
                <div className="text-red-500 text-sm">
                  Please select a gender
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="address" className="text-[#333333BF] text-sm">
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
                          : "border border-[#333333] rounded-md"
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
              <Label className="text-[#333333BF] text-sm">Email address</Label>
              <Input
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={
                  formik.errors.email && formik.touched.email
                    ? "border-red-500 rounded-none"
                    : "border border-[#333333] rounded-md"
                }
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-[#333333BF] text-sm">Phone number</Label>
              <Input
                name="phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                className={
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                    ? "border-red-500 rounded-none"
                    : "border border-[#333333] rounded-md"
                }
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <span className="text-sm text-[#333333BF] block pt-2">
            Appointment confirmation will be sent to this phone number.
          </span>
          <div className="flex md:mt-12 my-6 w-full">
            <Button
              type="submit"
              className="bg-[#E5573F] text-white px-6 py-5 w-full flex rounded-md"
              disabled={isLoading || formik.isSubmitting}
            >
              {isLoading || formik.isSubmitting ? (
                <span className="px-6">
                  <Loader2 className="animate-spin w-5 h-5" />
                </span>
              ) : (
                "Book appointment"
              )}
            </Button>
          </div>
          <span className="text-[#333333BF] text-sm">
            By continuing, you authorize us to book an appointment on your
            behalf.
          </span>
        </div>
      </form>
      <FooterSection />
    </>
  );
}
