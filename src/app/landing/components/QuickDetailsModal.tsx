// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactModal from "react-modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Autocomplete } from "../../../../components/ui/autocomplete";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { insuranceCarrierOptions } from "@/constants/store-constants";
import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

// Set the app element for accessibility - moved out of component to avoid React hooks rules issues
if (typeof window !== "undefined") {
  // In Next.js, we use document.body as a reliable app element
  ReactModal.setAppElement(document.body);
}

// Validation schema combining elements from both pages
const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  email: Yup.string().email("Invalid email").notRequired(),
  phoneNumber: Yup.string().notRequired(),
  dob: Yup.date()
    .required("Date of birth is required")
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  // Load existing form data from session storage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormData = sessionStorage.getItem("formData");
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
          insurer: parsedFormData?.insurer || "",
          selectedOption: parsedFormData?.selectedOption || "yes",
          insuranceType: parsedFormData?.insuranceType || "ppo",
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
          address: parsedFormData.address || "",
        });

        setInputValue(parsedFormData?.objective || "");
        setSelectedInsurance(parsedFormData?.selectedOption === "no");
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
      } else if (initialSpecialty) {
        // If no stored data but specialty is provided from parent
        formik.setFieldValue("specialty", initialSpecialty);
        // Save to session storage
        sessionStorage.setItem("selectedSpecialty", initialSpecialty);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      insuranceType: "ppo",
      selectedOption: "yes",
      availabilityOption: "anytime",
      timeOfAppointment: new Date(),
      specialty: initialSpecialty,
    },
    validationSchema,
    onSubmit: async (values) => {
      const temp_sepciality = sessionStorage.getItem("selectedSpecialty");
      track("QuickDetails_Btn_Clicked");

      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }

      setIsLoading(true);

      const updatedValues = {
        ...values,
        dob: formatDateToYYYYMMDD(values.dob),
        objective: values.objective || `${temp_sepciality} consultation`,
        subscriberId: values.subscriberId,
        selectedOption: selectedInsurance ? "no" : "yes",
        availability: customAvailability
          ? customAvailability
          : availabilityOption,
        maxWait: values.maxWait,
      };

      try {
        // Get existing form data if it exists
        const existingFormData = sessionStorage.getItem("formData");
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
        // Store form data in session storage
        window.sessionStorage.setItem("formData", JSON.stringify(mergedValues));

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

        if (updatePreferences) {
          onOpenChange(false);
          confirmUpdatePreferences();
        } else {
          // Redirect to next page
          router.push("/transcript?confirmed=true");
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
  };

  // Reset insurance fields when selectedOption changes to 'no'
  useEffect(() => {
    if (formik.values.selectedOption === "no") {
      // Reset insurance-related fields when user selects "no insurance"
      formik.setFieldValue("insurer", "");
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("insuranceType", "ppo");

      // Clear any validation errors for these fields
      const newErrors = { ...formik.errors };
      delete newErrors.insurer;
      delete newErrors.subscriberId;
      delete newErrors.insuranceType;
      formik.setErrors(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.selectedOption]);

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
      if (Object.keys(errors).length === 0 && gender) {
        formik.handleSubmit(e);
      } else {
        if (!gender) {
          formik.setFieldError("gender", "Please select a gender");
        }
        formik.setErrors(errors);
      }
    });
  };

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
          <h2 className="text-xl font-bold">
            Provide additional details to get appointments faster
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column layout for larger screens */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Appointment details */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[#333333BF] text-sm">Phone number</Label>
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
              <div className="space-y-3">
                <div className="flex justify-between pb-5">
                  <Label className="text-[#333333BF] text-base">Insurance</Label>
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
                      <Autocomplete
                        id="insurer"
                        name="insurer"
                        className={cn(
                          "w-full border border-[#333333] rounded-md",
                          formik.touched.insurer && formik.errors.insurer
                            ? "border-red-500"
                            : ""
                        )}
                        options={insuranceCarrierOptions}
                        value={formik.values.insurer}
                        selected={formik.values.insurer}
                        onChange={(value) => {
                          formik.setFieldValue("insurer", value);
                          formik.setFieldTouched("insurer", true);
                        }}
                        clearable={false}
                      />
                      {formik.touched.insurer && formik.errors.insurer && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.insurer}
                        </div>
                      )}
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
                  </>
                )}
              </div>

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
            </div>

            {/* Right column - Patient details */}
            <div className="space-y-5">
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
              {updatePreferences && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#333333BF] text-sm">
                      Patient name
                    </Label>
                    <Input
                      className={
                        formik.errors.patientName &&
                        formik.touched.patientName
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
                        className="w-full p-2 border border-[#333333] rounded-md"
                        wrapperClassName="w-full"
                        placeholderText="Select date of birth"
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

              <div className="space-y-2">
                <Label className="text-[#333333BF] text-sm">Gender</Label>
                <RadioGroup
                  name="gender"
                  value={gender}
                  onValueChange={handleGenderChange}
                  className="flex flex-row gap-4"
                >
                  {genderOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem
                        id={option.value}
                        value={option.value}
                      />
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
                <Label className="text-[#333333BF] text-sm">Email address</Label>
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
            <div className="flex md:mt-12 my-2 w-[80%] mx-auto">
              <Button
                type="submit"
                className="bg-[#E5573F] text-white px-6 py-5 w-full flex rounded-md"
                disabled={isLoading || formik.isSubmitting}
              >
                {isLoading || formik.isSubmitting ? (
                  <span className="px-6">
                    <Loader2 className="animate-spin w-5 h-5" />
                  </span>
                ) : updatePreferences ? (
                  "Modify My Request"
                ) : (
                  "Book appointment"
                )}
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <span className="text-[#333333BF] text-xs text-center">
              By continuing, you authorize us to book an appointment on your
              behalf.
            </span>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}