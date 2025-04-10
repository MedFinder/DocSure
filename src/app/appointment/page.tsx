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

const validationSchema = Yup.object().shape({
  objective: Yup.string().required("Please add at least one topic to discuss"),
  insurer: Yup.string().when('selectedOption', {
    is: 'yes',
    then: () => Yup.string().required("Insurance carrier is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
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
  const [customAvailability, setCustomAvailability] = useState("");
  const [availabilityOption, setAvailabilityOption] = useState("anytime");
  const [timeOfAppointment, setTimeOfAppointment] = useState(new Date());
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);

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
        console.log(parsedFormData)
        setFormData(parsedFormData);

        // Prefill formik values
        formik.setValues({
          objective: parsedFormData?.objective || "",
          insurer: parsedFormData?.insurer || "",
          selectedOption: parsedFormData?.selectedOption || "yes",
          insuranceType: parsedFormData?.insuranceType || "ppo",
          availability: parsedFormData?.availability || "anytime",
          subscriberId: parsedFormData?.subscriberId || "",
          maxWait: parsedFormData?.maxWait || 3
        });
        setPills(parsedFormData?.objective ? parsedFormData.objective.split(", ") : []);
        setSelectedInsurance(parsedFormData?.selectedOption === "no");
        setAvailabilityOption(parsedFormData?.availabilityOption || "anytime");
        setCustomAvailability(parsedFormData?.availability || "anytime");
        // Check if timeOfAppointment is a valid date
        if (parsedFormData?.timeOfAppointment) {
          const dateObj = new Date(parsedFormData.timeOfAppointment);
          setTimeOfAppointment(isNaN(dateObj.getTime()) ? new Date() : dateObj);
        } else {
          setTimeOfAppointment(new Date());
        }
        setIsNewPatient(parsedFormData?.isNewPatient === "yes");
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
  const logPatientData = async (updatedValues) => {
    const data = {
      // request_id: formData.request_id,
      // patient_name: formData.patientName,
      // patient_dob: formData.dob,
      // patient_email: formData.email,
      // patient_number: formData.phoneNumber,
      // patient_zipcode: "",

      request_id: updatedValues.request_id,
      new_patient: updatedValues.isNewPatient,
      time_of_appointment: updatedValues.timeOfAppointment,
      patient_availability: updatedValues.maxWait+' days',
      medical_concerns: updatedValues.objective,
      member_id: updatedValues?.subscriberId ?? "",
      insurer: updatedValues.insurer ?? "none",
      insurance_type: updatedValues?.insuranceType ?? "",
      group_number: updatedValues.groupId ?? "",
      has_insurance: !!updatedValues.insurer,
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
      objective: "",
      availability: "anytime",
      maxWait: 3,
      insurer: "",
      subscriberId: "",
      insuranceType: "ppo",
      selectedOption: "yes",
      isNewPatient: "yes",
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log(values)
      // insuranceType:"ppo"
      // subscriberId" '111222'
      // insurer:"1st Agency"
      // objective: "jjj"
      // selectedOption:"yes"
      // availability:"anytime"
      // track("ContactPage_Btn_Clicked");
      const savedSpecialty = sessionStorage.getItem("selectedSpecialty");
      const formData = JSON.parse(sessionStorage.getItem("formData"));

      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }
      const updatedValues = {
        groupId: values.groupId ?? '',
        subscriberId: values.subscriberId,
        objective: pills.length > 0 ? pills.join(", ") : values.objective,
        insurer: values.insurer ?? '',
        selectedOption: selectedInsurance === true ? "no" : "yes",
        availability: customAvailability
          ? customAvailability
          : availabilityOption,
        availabilityOption,
        specialty: savedSpecialty,
        timeOfAppointment,
        insuranceType: values.insuranceType,
        maxWait: values.maxWait,
        isNewPatient: isNewPatient ? "yes" : "no",
        request_id: formData?.request_id,
      };
      console.log(updatedValues)
      setIsLoading(true);
      logPatientData(updatedValues);
      sessionStorage.setItem("formData", JSON.stringify(updatedValues));
      setTimeout(() => {
        router.push("/contact");
      }, 1500);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Handle availability option change
  const handleAvailabilityChange = (value) => {
    setCustomAvailability('');
    setTimeOfAppointment('');
    setAvailabilityOption(value);
    formik.setFieldValue('availability', value);
  };

  // Handle insurance checkbox change
  const handleInsuranceCheckboxChange = (checked) => {
    setSelectedInsurance(checked);
    formik.setFieldValue('selectedOption', checked ? "no" : "yes");
  };

  // Add useEffect to reset insurance fields when selectedOption changes to 'no'
  useEffect(() => {
    if (formik.values.selectedOption === "no") {
      // Reset insurance-related fields when user selects "no insurance"
      formik.setFieldValue("insurer", "");
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("insuranceType", "ppo");
      
      // Also clear any validation errors for these fields
      const newErrors = {...formik.errors};
      delete newErrors.insurer;
      delete newErrors.subscriberId;
      delete newErrors.insuranceType;
      formik.setErrors(newErrors);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.selectedOption]);

  // Handle insurance type change
  const handleInsuranceTypeChange = (value) => {
    formik.setFieldValue('insuranceType', value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!pills.includes(inputValue.trim())) {
        setPills([...pills, inputValue.trim()]);
        formik.setFieldValue('objective', [...pills, inputValue.trim()].join(", "));
      }
      setInputValue("");
    }
  };
  const removePill = (value: string) => {
    const newPills = pills.filter((pill) => pill !== value);
    setPills(newPills);
    formik.setFieldValue('objective', newPills.join(", "));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to show errors
    Object.keys(formik.values).forEach((field) => {
      // console.log('touhced filed', field)
      formik.setFieldTouched(field, true);
    });

    // Set gender as touched
    setGenderTouched(true);

    // Validate all fields
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0 ) {
        formik.handleSubmit(e);
      } else {
        console.log(errors);
        // Force re-render to show all validation errors
        formik.setErrors(errors);
      }
    });
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
              className={cn("rounded-none", formik.touched.objective && formik.errors.objective ? "border-red-500" : "")}
            />
            {formik.touched.objective && formik.errors.objective && (
              <div className="text-red-500 text-sm">{formik.errors.objective}</div>
            )}

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
              value={availabilityOption}
              onValueChange={handleAvailabilityChange}
              name="availability"
              className="flex flex-col py-4 space-y-6"
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
                <div className="w-1/2 pl-6">
                  <DatePicker
                    selected={timeOfAppointment}
                    onChange={(date) => {
                      setTimeOfAppointment(date);
                      setCustomAvailability(formatDateToYYYYMMDD(date));
                      setAvailabilityOption('input-availability');
                    }}
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    minDate={new Date()}
                    autoComplete="off"
                    aria-autocomplete="none"
                    name="appointmentDate"
                    className="w-full p-2 border rounded-none"
                    wrapperClassName="w-full"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link-calender" id="r3" />
                <Label className="underline">Link your calender</Label>
              </div>
            </RadioGroup>
            {formik.touched.availability && formik.errors.availability && (
              <div className="text-red-500 text-sm">{formik.errors.availability}</div>
            )}
          </div>
          <div className="space-y-6 pt-4">
            <Label className="text-[#333333BF] text-sm">Max Wait</Label>
            <Slider 
              //showTooltip={true} 
              value={[formik.values.maxWait]}
              //defaultValue={[3]} 
              onValueChange={(value) => {
                formik.setFieldValue('maxWait', value[0]);
                // Force a re-render to update the tooltip
                formik.setFieldTouched('maxWait', true);
              }}
            />
            <div className="text-sm text-gray-500 mt-1">
              Max wait: {formik.values.maxWait} {formik.values.maxWait === 1 ? 'day' : 'days'}
            </div>
            {formik.touched.maxWait && formik.errors.maxWait && (
              <div className="text-red-500 text-sm">{formik.errors.maxWait}</div>
            )}
          </div>
          <span className="text-xs block pt-8 text-[#E5573F]">
            Longer wait time = better doctors
          </span>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <Label className="text-[#333333BF] text-base">Insurance</Label>
              <span className="text-sm text-gray-600 block pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="no-insurance" 
                    checked={selectedInsurance}
                    onCheckedChange={handleInsuranceCheckboxChange}
                  />
                  <Label
                    htmlFor="no-insurance"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Don't have insurance
                  </Label>
                </div>
              </span>
            </div>
            {!selectedInsurance && (
              <>
                <Label className="text-[#333333BF] text-sm space-y-2 pt-2">
                  Insurer
                </Label>

                <div className="flex-1 border-gray-400 md:border-none">
                  <Autocomplete
                    id="insurer"
                    name="insurer"
                    className={cn("w-full border", formik.touched.insurer && formik.errors.insurer ? "border-red-500" : "")}
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
                    <div className="text-red-500 text-sm">{formik.errors.insurer}</div>
                  )}
                </div>
              </>
            )}
          </div>

          {!selectedInsurance && (
            <div className="space-y-6">
              <div className="space-y-4 pt-4">
                <Label className="text-[#333333BF] text-sm space-y-2">
                  Member ID (Optional)
                </Label>
                <Input 
                  className={cn("rounded-none border", formik.touched.subscriberId && formik.errors.subscriberId ? "border-red-500" : "")}
                  value={formik.values.subscriberId}
                  onChange={(e) => formik.setFieldValue("subscriberId", e.target.value)}
                  onBlur={formik.handleBlur}
                  name="subscriberId"
                />
                {formik.touched.subscriberId && formik.errors.subscriberId && (
                  <div className="text-red-500 text-sm">{formik.errors.subscriberId}</div>
                )}
              </div>
              <RadioGroup 
                value={formik.values.insuranceType}
                onValueChange={handleInsuranceTypeChange}
                className="flex gap-12"
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
              {formik.touched.insuranceType && formik.errors.insuranceType && (
                <div className="text-red-500 text-sm">{formik.errors.insuranceType}</div>
              )}
            </div>
          )}

          <div className="flex md:mt-12 mt-6 w-full">
            <Button
              type="submit"
              className="bg-[#E5573F] text-white px-6 py-5 w-full sm:w-auto flex rounded-md"
              disabled={isLoading || formik.isSubmitting}
            >
              {isLoading || formik.isSubmitting ? (
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
      <FooterSection />
    </div>
  );
}
