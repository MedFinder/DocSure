//@ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import ReactModal from "react-modal";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import Select from "@/components/ui/client-only-select";

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    boxShadow: "none",
    borderRadius: "0.5rem",
    border: "1px solid black",
    borderColor: "black",
    minHeight: "40px",
    fontSize: "14px",
    padding: "2px 4px",
    "&:hover": {
      borderColor: "black",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
    textAlign: "left",
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
    padding: "8px 12px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px", // Reduced font size for options
  }),
  indicatorsContainer: () => ({
    display: "none", // removes the dropdown arrow
  }),
};
// Set the app element for accessibility - moved out of component to avoid React hooks rules issues
if (typeof window !== "undefined") {
  // In Next.js, we use document.body as a reliable app element
  ReactModal.setAppElement(document.body);
}

// Validation schema combining elements from both pages
const validationSchema = Yup.object().shape({
  patientName: Yup.string().notRequired("Patient name is required"),
  email: Yup.string().email("Invalid email").notRequired(),
  phoneNumber: Yup.string().notRequired(),
  dob: Yup.date()
    .notRequired("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  gender: Yup.string().notRequired(),
  availabilityOption: Yup.string().notRequired(),
  timeOfAppointment: Yup.string().when("availabilityOption", {
    is: "input-availability",
    then: () => Yup.string().required("Please describe your availability"),
    otherwise: () => Yup.string().notRequired(),
  }),
  subscriberId: Yup.string().when("selectedOption", {
    is: "yes",
    then: () => Yup.string().notRequired(),
    otherwise: () => Yup.string().notRequired(),
  }),
  insuranceType: Yup.string().when("insurer", {
    is: (val) => val && val.length > 0,
    then: () =>
      Yup.string().required("Please select an insurance type (PPO or HMO)"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non-binary", label: "Non-binary" },
];

export default function QuickDetailsModal({
  open,
  onOpenChange,
  updatePreferences = false,
  confirmUpdatePreferences,
  initialSpecialty = "",
  setispreferencesUpdated,
  setIsPreferencesReinitialized,
}) {
  const [inputValue, setInputValue] = useState("");
  const [pills, setPills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const addressRefs = useRef([]);
  const router = useRouter();

  const [customAvailability, setCustomAvailability] = useState("");
  const [availabilityOption, setAvailabilityOption] = useState("anytime");
  const [timeOfAppointment, setTimeOfAppointment] = useState(new Date());
  const [gender, setGender] = useState("");
  const [genderTouched, setGenderTouched] = useState(false);

  // Custom styles for react-modal
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative",
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      maxWidth: "3xl",
      width: "48rem",
      maxHeight: "90vh",
      padding: "2rem",
      borderRadius: "0.5rem",
      backgroundColor: "#fff",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      overflow: "auto",
    },
  };

  // Utility function to format date without timezone issues
  const formatDateToYYYYMMDD = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  const formatDateToMmDdYyyy = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}/${day}/${year}`;
    } else {
      return "";
    }
  };

  const formatDateInput = (input) => {
    const cleanedInput = input.replace(/[^\d]/g, "");
    const parts = [];
    if (cleanedInput.length > 0) parts.push(cleanedInput.slice(0, 2));
    if (cleanedInput.length > 2) parts.push(cleanedInput.slice(2, 4));
    if (cleanedInput.length > 4) parts.push(cleanedInput.slice(4, 8));
    return parts.join("/");
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDCPbnPb43gQZDPT5dpq10a3dOP3EMHw-0",
    libraries: ["places"],
  });

  // Load existing form data from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormData = localStorage.getItem("formData");
      const storedLocation = localStorage.getItem("selectedLocation");
      if (storedFormData) {
        const parsedFormData = JSON.parse(storedFormData);
        setFormData(parsedFormData);

        // Prefill formik values
        formik.setValues({
          objective: parsedFormData?.objective || "",
          patientName: parsedFormData.patientName || "",
          phoneNumber: parsedFormData.phoneNumber || "",
          email: parsedFormData.email || "",
          dob: parsedFormData.dob ? new Date(parsedFormData.dob) : null,
          gender: parsedFormData.gender || "",
          specialty: parsedFormData.specialty || "",
          address: parsedFormData.address || "",
          insurer: parsedFormData?.insurer || "",
          selectedOption: parsedFormData?.insurer
            ? "no"
            : parsedFormData?.selectedOption,
          insuranceType: parsedFormData?.insuranceType || "",
          availability: parsedFormData?.availability || "anytime",
          subscriberId: parsedFormData?.subscriberId || "",
          maxWait: parsedFormData?.maxWait
            ? parsedFormData?.maxWait
            : parsedFormData?.specialty === "Primary Care Physician"
            ? 3
            : 10,
          availabilityOption: parsedFormData?.availabilityOption || "anytime",
          timeOfAppointment: parsedFormData?.timeOfAppointment
            ? new Date(parsedFormData.timeOfAppointment)
            : new Date(),
        });

        setInputValue(parsedFormData?.objective || "");
        setSelectedInsurance(parsedFormData?.insurer ? false : true);
        setAvailabilityOption(parsedFormData?.availabilityOption || "anytime");
        setCustomAvailability(parsedFormData?.availability || "anytime");
        setGender(parsedFormData.gender || "");

        // Check if timeOfAppointment is a valid date
        if (parsedFormData?.timeOfAppointment) {
          const dateObj = new Date(parsedFormData.timeOfAppointment);
          setTimeOfAppointment(isNaN(dateObj.getTime()) ? new Date() : dateObj);
        } else {
          setTimeOfAppointment(new Date());
        }

        // Revalidate the form
        formik.validateForm();
      }
      if (storedLocation) {
        const { lat, lng } = JSON.parse(storedLocation);
        setSelectedLocation({ lat, lng });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const logPatientData = async (updatedValues) => {
    // console.log(updatedValues)
    const data = {
      patient_name: updatedValues.patientName,
      patient_number: updatedValues.phoneNumber,
      patient_email: updatedValues.email,
      patient_date_of_birth: updatedValues.dob,
      insurer: updatedValues.insurer ?? "",
      address: updatedValues.address ?? "",
      new_patient: true,
      preferred_time_of_appointment: updatedValues.timeOfAppointment,
      patient_availability: updatedValues.availability,
      medical_concerns: updatedValues.objective,
      member_id: updatedValues?.subscriberId ?? "",
      insurance_type: updatedValues?.insuranceType ?? "",
      group_number: updatedValues.subscriberId ?? "",
      has_insurance: !!updatedValues.insurer,
    };
    // console.log(data);
    try {
      const resp = await axios.put(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-patientdata/${formData.request_id}`,
        data
      );
      return;
    } catch (error) {
      return null;
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

  const formik = useFormik({
    initialValues: {
      objective: "",
      patientName: "",
      phoneNumber: "",
      email: "",
      dob: null,
      gender: "",
      address: "",
      availability: "anytime",
      maxWait: 3,
      insurer: "",
      subscriberId: "",
      insuranceType: "",
      selectedOption: "yes",
      availabilityOption: "anytime",
      timeOfAppointment: new Date(),
      specialty: initialSpecialty,
    },
    validationSchema,
    onSubmit: async (values) => {
      updatePreferences && setIsPreferencesReinitialized(false);
      const speciality_value =
        formik.values.specialty === "Prescription / Refill"
          ? "Primary Care Physician"
          : formik.values.specialty;
      track("QuickDetails_Btn_Clicked");
      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }

      setIsLoading(true);

      const updatedValues = {
        ...values,
        dob: formatDateToYYYYMMDD(values.dob),
        objective: values.objective || "",
        subscriberId: values.subscriberId,
        selectedOption: selectedInsurance ? "no" : "yes",
        availability: customAvailability
          ? customAvailability
          : availabilityOption,
        maxWait: values.maxWait,
        email: values.email || "",
      };
      // console.log(updatedValues)

      try {
        // Get existing form data if it exists
        const existingFormData = localStorage.getItem("formData");
        let mergedValues = updatedValues;
        // if (formik.values.specialty) {
        //   localStorage.setItem("selectedSpecialty", formik.values.specialty);
        // }

        if (existingFormData) {
          try {
            const parsedExistingData = JSON.parse(existingFormData);

            // Check if address or specialty changed
            const addressChanged =
              parsedExistingData.address !== updatedValues.address;
            const specialtyChanged =
              parsedExistingData.specialty !== updatedValues.specialty;

            // Merge existing data with new values (new values take precedence)
            mergedValues = { ...parsedExistingData, ...updatedValues };
            logPatientData(mergedValues);

            // If address or specialty changed, refetch doctor lists
            if (addressChanged || specialtyChanged) {
              console.log("address or speciality changed");
              updatePreferences && setIsPreferencesReinitialized(true);
              refetchDrLists();
            }
          } catch (error) {
            console.error("Error parsing existing form data:", error);
          }
        }
        // Store form data in localStorage
        window.localStorage.setItem("formData", JSON.stringify(mergedValues));

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

        if (updatePreferences) {
          setispreferencesUpdated(true);
          onOpenChange(false);
          confirmUpdatePreferences();
        } else {
          onOpenChange(false);
          // router.push("/transcript?confirmed=true");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
        onOpenChange(false); // Close modal
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const refetchDrLists = async () => {
    try {
      const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };

      localStorage.setItem(
        "searchData",
        JSON.stringify({ lat, lng, specialty: formik.values.specialty })
      );
      const data = {
        location: `${lat},${lng}`,
        radius: 20000,
        keyword: formik.values.specialty,
      };
      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
        data
      );

      localStorage.setItem("statusData", JSON.stringify(response.data));
      localStorage.setItem("lastSearchSource", "navbar"); // Track last search source

      window.dispatchEvent(new Event("storage"));

      // console.log("Form Data:", values);
      console.log("API Response Data:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  // Handle availability option change
  const handleAvailabilityChange = (value) => {
    setCustomAvailability("");
    setTimeOfAppointment(new Date());
    setAvailabilityOption(value);
    formik.setFieldValue("availabilityOption", value);
    formik.setFieldValue("availability", value);

    // When changing away from input-availability, clear any validation errors
    if (value !== "input-availability") {
      const newErrors = { ...formik.errors };
      delete newErrors.timeOfAppointment;
      formik.setErrors(newErrors);
    } else {
      // When changing to input-availability, validate the current date
      formik.setFieldTouched("timeOfAppointment", true);
      formik.validateField("timeOfAppointment");
    }
  };

  // Handle insurance checkbox change
  const handleInsuranceCheckboxChange = (checked) => {
    setSelectedInsurance(checked);
    formik.setFieldValue("selectedOption", checked ? "no" : "yes");
    if (checked) {
      formik.setFieldValue("insurer", "");
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("insuranceType", "");
      updateInsuranceInStorage("");
    }
  };

  // Reset insurance fields when selectedOption changes to 'no'
  // useEffect(() => {
  //   if (formik.values.selectedOption === "no") {
  //     console.log('lagooooo', console.log(formik.values.selectedOption))
  //     // Reset insurance-related fields when user selects "no insurance"
  //     formik.setFieldValue("insurer", "");
  //     formik.setFieldValue("subscriberId", "");
  //     formik.setFieldValue("insuranceType", "");

  //     // Clear any validation errors for these fields
  //     const newErrors = { ...formik.errors };
  //     delete newErrors.insurer;
  //     delete newErrors.subscriberId;
  //     delete newErrors.insuranceType;
  //     formik.setErrors(newErrors);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formik.values]);

  // Handle insurance type change
  const handleInsuranceTypeChange = (value) => {
    formik.setFieldValue("insuranceType", value);
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
        localStorage.setItem(
          "selectedLocation",
          JSON.stringify({
            lat: address.geometry.location.lat(),
            lng: address.geometry.location.lng(),
          })
        );
      }
    }
  };

  // Update objective in formik when inputValue changes
  useEffect(() => {
    formik.setFieldValue("objective", inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // Add pill on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!pills.includes(inputValue.trim())) {
        setPills([...pills, inputValue.trim()]);
        formik.setFieldValue(
          "objective",
          [...pills, inputValue.trim()].join(", ")
        );
      }
      setInputValue("");
    }
  };

  // Add pill on blur
  const handleInputBlur = () => {
    if (inputValue.trim() !== "") {
      if (!pills.includes(inputValue.trim())) {
        setPills([...pills, inputValue.trim()]);
        formik.setFieldValue(
          "objective",
          [...pills, inputValue.trim()].join(", ")
        );
      }
      setInputValue("");
    }
  };

  // Remove pill
  const removePill = (value: string) => {
    const newPills = pills.filter((pill) => pill !== value);
    setPills(newPills);
    formik.setFieldValue("objective", newPills.join(", "));
  };

  // Custom handler for date picker
  const handleDateChange = (date) => {
    formik.setFieldValue("dob", date);
    formik.setFieldTouched("dob", true); // Mark as touched when changed
  };

  // Update gender
  const handleGenderChange = (value) => {
    setGender(value);
    formik.setFieldValue("gender", value);
    if (!genderTouched) {
      setGenderTouched(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to show errors
    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    setGenderTouched(true);

    // Validate all fields
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit(e);
      } else {
        console.log("Validation errors:", errors);
        // if (!gender) {
        //   formik.setFieldError("gender", "Please select a gender");
        // }
        formik.setErrors(errors);
      }
    });
  };
  function handleCreateOptions() {
    return null;
  }
  const getOptionFromLabel = (options, label) =>
    options.find((opt) => opt.label === label);
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      style={customStyles}
      contentLabel="Appointment Details"
      closeTimeoutMS={300}
    >
      <div className="relative">
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mb-6">
          <h2 className="text-xl pr-12 font-bold">
            Provide additional details to get appointments faster
          </h2>
        </div>

        <section className="space-y-6">
          {/* Two-column layout for larger screens */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Appointment details */}
            <div className="space-y-5">
              {updatePreferences && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#333333BF] text-sm">
                      Medical Specialty
                    </Label>
                    <Select
                      styles={customSelectStyles}
                      id="specialty"
                      name="specialty"
                      className={cn(
                        "w-full ",
                        formik.touched.specialty && formik.errors.specialty
                          ? "border-red-500"
                          : ""
                      )}
                      options={medicalSpecialtiesOptions}
                      placeholder="Medical specialty"
                      value={getOptionFromLabel(
                        medicalSpecialtiesOptions,
                        formik.values.specialty
                      )}
                      onChange={(selected) => {
                        const specialtyString = selected?.label || "";
                        formik.setFieldValue("specialty", specialtyString);
                        formik.setFieldTouched("specialty", true); //
                      }}
                      clearable={false}
                      navbar
                    />
                    {formik.touched.specialty && formik.errors.specialty && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.specialty}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#333333BF] text-sm">
                      Patient name
                    </Label>
                    <Input
                      className={
                        formik.errors.patientName && formik.touched.patientName
                          ? "border-red-500 rounded-md"
                          : "border border-[#333333] rounded-md"
                      }
                      name="patientName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.patientName}
                      placeholder="Full name"
                    />
                    {formik.errors.patientName &&
                      formik.touched.patientName && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.patientName}
                        </div>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#333333BF] text-sm">
                      Date of Birth
                    </Label>
                    <div
                      className={`w-full ${
                        formik.errors.dob && formik.touched.dob
                          ? "date-picker-error"
                          : ""
                      }`}
                    >
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/DD/YYYY"
                        name="dob"
                        className={
                          formik.errors.dob && formik.touched.dob
                            ? "border-red-500 w-full p-2 rounded-md"
                            : "w-full p-2 border border-[#333333] rounded-md"
                        }
                        value={
                          formik.values.dob
                            ? typeof formik.values.dob === "string"
                              ? formik.values.dob
                              : formatDateToMmDdYyyy(formik.values.dob)
                            : ""
                        }
                        onChange={(e) => {
                          const input = e.target.value;
                          const formattedInput = formatDateInput(input);

                          if (formattedInput !== input) {
                            e.target.value = formattedInput;
                          }

                          // Convert formatted string to Date object if complete
                          if (formattedInput.length === 10) {
                            const [month, day, year] =
                              formattedInput.split("/");
                            const date = new Date(
                              parseInt(year),
                              parseInt(month) - 1,
                              parseInt(day)
                            );

                            if (!isNaN(date.getTime()) && date <= new Date()) {
                              formik.setFieldValue("dob", date);
                            } else {
                              formik.setFieldValue("dob", formattedInput);
                            }
                          } else {
                            formik.setFieldValue("dob", formattedInput);
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {formik.errors.dob && formik.touched.dob && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.dob}
                      </div>
                    )}
                  </div>
                </>
              )}
              {updatePreferences && (
                <div className="space-y-2">
                  <Label className="text-[#333333BF] text-sm">
                    Phone number
                  </Label>
                  <Input
                    className={
                      formik.errors.phoneNumber && formik.touched.phoneNumber
                        ? "border-red-500 rounded-md"
                        : "border border-[#333333] rounded-md"
                    }
                    name="phoneNumber"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    placeholder="Your phone number"
                  />
                  <span className="text-[#333333BF] text-xs text-center">
                    Appointment confirmation will be sent to this number.
                  </span>
                  {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-3">
                <div className="flex justify-between pb-5">
                  <Label className="text-[#333333BF] text-base">
                    Insurance
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-insurance"
                      checked={selectedInsurance}
                      onCheckedChange={handleInsuranceCheckboxChange}
                    />
                    <Label
                      htmlFor="no-insurance"
                      className="text-sm font-medium leading-none"
                    >
                      Don't have insurance
                    </Label>
                  </div>
                </div>

                {!selectedInsurance && (
                  <>
                    <Label className="text-[#333333BF] text-sm">Insurer</Label>
                    <div className="flex-1">
                      <Select
                        styles={customSelectStyles}
                        id="insurer"
                        placeholder="Search insurer"
                        name="insurer"
                        className={cn(
                          "w-full ",
                          formik.touched.insurer && formik.errors.insurer
                            ? "border-red-500"
                            : ""
                        )}
                        options={insuranceCarrierOptions}
                        value={getOptionFromLabel(
                          insuranceCarrierOptions,
                          formik.values.insurer
                        )}
                        onChange={(selected) => {
                          const insurerString = selected?.label || "";
                          formik.setFieldValue("insurer", insurerString);
                          formik.setFieldTouched("insurer", true); //
                        }}
                        navbar
                      />
                      {formik.touched.insurer && formik.errors.insurer && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.insurer}
                        </div>
                      )}
                      <span className="text-[#333333BF] text-xs text-center">
                        We will verify that the clinic accepts your insurance.
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <Label className="text-[#333333BF] text-sm">
                        Member ID
                      </Label>
                      <Input
                        className={"border border-[#333333] rounded-md"}
                        name="subscriberId"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.subscriberId || ""}
                        placeholder="Insurance Member ID"
                      />
                    </div>
                    <div>
                      <RadioGroup
                        value={formik.values.insuranceType}
                        onValueChange={handleInsuranceTypeChange}
                        className="flex gap-12 mt-5"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ppo" id="r1" />
                          <Label htmlFor="r1">PPO</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hmo" id="r2" />
                          <Label htmlFor="r2">HMO</Label>
                        </div>
                      </RadioGroup>
                      {formik.touched.insuranceType &&
                        formik.errors.insuranceType && (
                          <div className="text-red-500 text-sm mt-2">
                            {formik.errors.insuranceType}
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>

              {!updatePreferences && (
                <div className="space-y-2">
                  <Label className="text-sm text-[#333333BF]">
                    What would you like to discuss?
                  </Label>
                  <Input
                    value={inputValue}
                    placeholder="Knee pain, fever, skin rash..."
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                      "h-[40px] border border-[#333333] rounded-md",
                      formik.touched.objective && formik.errors.objective
                        ? "border-red-500"
                        : ""
                    )}
                  />
                  {formik.touched.objective && formik.errors.objective && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.objective}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right column - Patient details */}
            <div className="space-y-5">
              {updatePreferences && (
                <div className="space-y-2">
                  <Label className="text-sm text-[#333333BF]">
                    What would you like to discuss?
                  </Label>
                  <Input
                    value={inputValue}
                    placeholder="Knee pain, fever, skin rash..."
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                      "h-[40px] border border-[#333333] rounded-md",
                      formik.touched.objective && formik.errors.objective
                        ? "border-red-500"
                        : ""
                    )}
                  />
                  {formik.touched.objective && formik.errors.objective && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.objective}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-3">
                <Label className="text-[#333333BF]">Patient availability</Label>

                <RadioGroup
                  value={availabilityOption}
                  onValueChange={handleAvailabilityChange}
                  name="availability"
                  className="flex flex-col py-2 space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anytime" id="r1" />
                    <Label htmlFor="r1">Available Anytime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="input-availability" id="r2" />
                    <Label htmlFor="r2">Input your availability</Label>
                  </div>
                  {availabilityOption === "input-availability" && (
                    <div className="w-full pl-6">
                      <Input
                        name="customAvailability"
                        value={customAvailability}
                        onChange={(e) => {
                          setCustomAvailability(e.target.value);
                          setAvailabilityOption("input-availability");
                          formik.setFieldValue(
                            "timeOfAppointment",
                            e.target.value
                          );
                          formik.setFieldTouched("timeOfAppointment", true);
                        }}
                        onBlur={formik.handleBlur}
                        placeholder="Weekdays after 5pm, Weekends 9am-3pm"
                        className={cn(
                          "w-full border rounded-md",
                          formik.touched.timeOfAppointment &&
                            formik.errors.timeOfAppointment
                            ? "border-red-500"
                            : ""
                        )}
                      />
                      {formik.touched.timeOfAppointment &&
                        formik.errors.timeOfAppointment && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.timeOfAppointment}
                          </div>
                        )}
                    </div>
                  )}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <Label className="text-[#333333BF] text-sm">
                    Max wait time:
                  </Label>
                  <span className="text-sm text-gray-500 pl-2">
                    {formik.values.maxWait}{" "}
                    {formik.values.maxWait === 1 ? "day" : "days"}
                  </span>
                </div>
                <Slider
                  value={[formik.values.maxWait]}
                  onValueChange={(value) => {
                    formik.setFieldValue("maxWait", value[0]);
                    formik.setFieldTouched("maxWait", true);
                  }}
                />
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
                {/* {genderTouched && !gender && (
                  <div className="text-red-500 text-sm">
                    Please select a gender
                  </div>
                )} */}
              </div>
              <div className="space-y-2">
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="address" className="text-[#333333] w-auto">
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
                <Label className="text-[#333333BF] text-sm">
                  Email address
                </Label>
                <Input
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="your.email@example.com"
                  className={
                    formik.errors.email && formik.touched.email
                      ? "border-red-500 rounded-md"
                      : "border border-[#333333] rounded-md"
                  }
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex md:mt-12 my-2 md:w-[80%] w-full mx-auto">
              <Button
                onClick={handleSubmit}
                type="submit"
                className="bg-[#E5573F] text-white px-6 py-5 w-full flex rounded-md"
                disabled={isLoading || formik.isSubmitting}
              >
                {isLoading || formik.isSubmitting ? (
                  <span className="px-6">
                    <Loader2 className="animate-spin w-5 h-5" />
                  </span>
                ) : updatePreferences ? (
                  "Update"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
          {updatePreferences && (
            <div className="w-full flex justify-center">
              <span className="text-[#333333BF] text-xs text-center">
                By continuing, you authorize us to book an appointment on your
                behalf.
              </span>
            </div>
          )}
        </section>
      </div>
    </ReactModal>
  );
}
