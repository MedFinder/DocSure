//@ts-nocheck
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
import { Loader2, X } from "lucide-react";

import NavbarSection from "@/components/general-components/navbar-section";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { insuranceCarrierOptions } from "@/constants/store-constants";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
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
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  address: Yup.string().required("Address is required"),
  gender: Yup.string().required("Please select a gender"),
});

export default function AppointmentPage() {
  const [inputValue, setInputValue] = useState("");
  const [pills, setPills] = useState<string[]>([]);
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
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormData = sessionStorage.getItem("formData");
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

      const storedSearchData = sessionStorage.getItem("searchData");
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

  // Custom handler for date picker
  const handleDateChange = (date) => {
    formik.setFieldValue("dob", date);
    formik.setFieldTouched("dob", true); // Mark as touched when changed
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!pills.includes(inputValue.trim())) {
        setPills([...pills, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removePill = (value: string) => {
    setPills(pills.filter((pill) => pill !== value));
  };
  return (
    <div>
      <NavbarSection />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center md:px-6 sm:px-10 mt-40 md:mt-16"
      >
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            Appointment Details
          </p>
          <div className="w-full space-y-4 py-4">
            <Label className="text-sm space-y-2 text-[#333333BF]">
              What would you like to discuss?
            </Label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-none"
            />

            {pills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 text-black">
                {pills.map((pill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-full px-3 py-2 flex items-center gap-2 font-normal bg-[#EFEADE]"
                  >
                    {pill}
                    <button
                      type="button"
                      onClick={() => removePill(pill)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            <Label className="text-[#333333BF]">Patient availability</Label>

            <RadioGroup
              defaultValue="anytime"
              name="availability "
              className=" flex  flex-col py-4 space-y-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anytime" id="r1" />
                <Label htmlFor="r1">Available Anytime</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="input-availability" id="r2" />
                <Label htmlFor="r2">Input your availability</Label>
              </div>
              <div className="w-1/2 pl-6">
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
                  name="dob"
                  className="w-1/2 p-2 border rounded-none"
                  wrapperClassName="w-1/2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link-calender" id="r3" />
                <Label className="underline">Link your calender</Label>
              </div>
            </RadioGroup>
          </div>
          <div className=" space-y-6 pt-4">
            <Label className="text-[#333333BF] text-sm">Max Wait</Label>
            <Slider showTooltip={true} defaultValue={[3]} />
          </div>
          <span className="text-xs block pt-8 text-[#E5573F]">
            Longer wait time = better doctors
          </span>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <Label className="text-[#333333BF] text-base">Insurance</Label>
              <span className="text-sm text-gray-600 block pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="no-insurance" />
                  <Label
                    htmlFor="no-insurance"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Don’t have insurance
                  </Label>
                </div>
              </span>
            </div>
            <Label className="text-[#333333BF] text-sm space-y-2 pt-2">
              Insurer
            </Label>

            <div className="flex-1  border-gray-400 md:border-none">
              <Autocomplete
                id="insurer"
                name="insurer"
                className="w-full border"
                options={insuranceCarrierOptions}
                value={formik.values.insurance_carrier}
                selected={formik.values.insurance_carrier}
                onChange={(value) => {
                  formik.setFieldValue("insurance_carrier", value);
                }}
                clearable={false}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 pt-4">
              <Label className="text-[#333333BF] text-sm space-y-2">
                Member ID
              </Label>
              <Input className="rounded-none border" />
            </div>
            <RadioGroup defaultValue="hmo" className="flex gap-12">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppo" id="r1" />
                <Label htmlFor="r1">PPO</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hmo" id="r2" />
                <Label htmlFor="r2">HMO</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex  md:mt-12 mt-6 w-full">
            <Link href="/contact-new" className="w-full md:w-auto">
              <Button
                //   type="submit"
                className="bg-[#E5573F] text-white px-6 py-5 w-full sm:w-auto flex  rounded-md "
                //   disabled={isLoading}
              >
                {isLoading ? (
                  <span className="px-6">
                    <Loader2 className="animate-spin w-5 h-5" />
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </Link>
          </div>
        </div>
      </form>
      <FooterSection />
    </div>
  );
}
