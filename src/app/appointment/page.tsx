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
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { track } from "@vercel/analytics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Loader2, X } from "lucide-react";

import NavbarSection from "@/components/general-components/navbar-section";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { insuranceCarrierOptions } from "@/constants/store-constants";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import FooterSection from "../landing/components/FooterSection";
import QuickDetailsModal from "../landing/components/QuickDetailsModal";

const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
});

export default function AppointmentPage() {
  const [inputValue, setInputValue] = useState("");
  const [pills, setPills] = useState<string[]>([]);
  const [formData, setFormData] = useState({});
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const router = useRouter();

  const [customAvailability, setCustomAvailability] = useState("");
  const [availabilityOption, setAvailabilityOption] = useState("anytime");
  const [timeOfAppointment, setTimeOfAppointment] = useState(new Date());
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormData = localStorage.getItem("formData");
      const storedSpeciality = localStorage.getItem("selectedSpecialty");
      if (storedFormData) {
        const parsedFormData = JSON.parse(storedFormData);
        console.log(parsedFormData);
        setFormData(parsedFormData);

        // Prefill formik values
        formik.setValues({
          patientName: parsedFormData?.patientName || "",
          dob: parsedFormData.dob ? new Date(parsedFormData.dob) : null,
          phoneNumber: parsedFormData.phoneNumber || "",
          objective: parsedFormData?.objective || "",
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
        });
        setSelectedSpecialty(storedSpeciality);
        setInputValue(parsedFormData?.objective);
        setSelectedInsurance(parsedFormData?.selectedOption === "no");
        setAvailabilityOption(parsedFormData?.availabilityOption || "anytime");
        setCustomAvailability(parsedFormData?.availability || "anytime");
        if (parsedFormData?.timeOfAppointment) {
          const dateObj = new Date(parsedFormData.timeOfAppointment);
          setTimeOfAppointment(isNaN(dateObj.getTime()) ? new Date() : dateObj);
        } else {
          setTimeOfAppointment(new Date());
        }
        setIsNewPatient(parsedFormData?.isNewPatient === "yes");
        formik.validateForm();
      }

      const storedSearchData = localStorage.getItem("searchData");
      if (storedSearchData) {
        setSearchData(JSON.parse(storedSearchData));
      }
    }
  }, []);
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
  useEffect(() => {
    async function fetchAndLogData() {
      const drsData = localStorage.getItem("statusData");
      const formData = JSON.parse(localStorage.getItem("formData"));
      console.log(formData);
      if (drsData) {
        const parsedDrsData = JSON.parse(drsData);
        const payload = {
          request_id: formData?.request_id,
          ...parsedDrsData,
        };
        await logDrLists(payload);
      }
    }
    fetchAndLogData();
  }, []);

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToMmDdYyyy = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const formatDateInput = (input) => {
    const cleanedInput = input.replace(/\D/g, "");
    const parts = [];
    if (cleanedInput.length > 0) parts.push(cleanedInput.slice(0, 2));
    if (cleanedInput.length > 2) parts.push(cleanedInput.slice(2, 4));
    if (cleanedInput.length > 4) parts.push(cleanedInput.slice(4, 8));
    return parts.join("/");
  };

  const logPatientData = async (updatedValues) => {
    const data = {
      request_id: updatedValues.request_id,
      new_patient: updatedValues.isNewPatient,
      time_of_appointment: updatedValues.timeOfAppointment,
      patient_availability: updatedValues.maxWait + " days",
      medical_concerns: updatedValues.objective,
      member_id: updatedValues?.subscriberId ?? "",
      insurer: updatedValues.insurer ?? "none",
      insurance_type: updatedValues?.insuranceType ?? "",
      group_number: updatedValues.groupId ?? "",
      has_insurance: !!updatedValues.insurer,
    };
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

  const formik = useFormik({
    initialValues: {
      patientName: formData.patientName || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      address: formData.address || "",
      dob: formData.dob ? new Date(formData.dob) : null,
      gender: formData.gender || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("AppointmentDetail_Btn_Clicked");
      const savedSpecialty = localStorage.getItem("selectedSpecialty");
      const formData = JSON.parse(localStorage.getItem("formData"));

      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }
      const updatedFormData = {
        ...formData,
        ...values,
        dob: formatDateToYYYYMMDD(values.dob),
      };
      // console.log(updatedFormData);
      // logPatientData(updatedFormData);
      setIsLoading(true);
      // Simulate a 1-second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      window.localStorage.setItem("formData", JSON.stringify(updatedFormData));

      router.push("/transcript?confirmed=true");
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleAvailabilityChange = (value) => {
    setCustomAvailability("");
    setTimeOfAppointment(new Date());
    setAvailabilityOption(value);
    formik.setFieldValue("availabilityOption", value);
    formik.setFieldValue("availability", value);

    if (value !== "input-availability") {
      const newErrors = { ...formik.errors };
      delete newErrors.timeOfAppointment;
      formik.setErrors(newErrors);
    } else {
      formik.setFieldTouched("timeOfAppointment", true);
      formik.validateField("timeOfAppointment");
    }
  };

  const handleInsuranceCheckboxChange = (checked) => {
    setSelectedInsurance(checked);
    formik.setFieldValue("selectedOption", checked ? "no" : "yes");
  };

  useEffect(() => {
    if (formik.values.selectedOption === "no") {
      formik.setFieldValue("insurer", "");
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("insuranceType", "ppo");

      const newErrors = { ...formik.errors };
      delete newErrors.insurer;
      delete newErrors.subscriberId;
      delete newErrors.insuranceType;
      formik.setErrors(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.selectedOption]);

  const handleInsuranceTypeChange = (value) => {
    formik.setFieldValue("insuranceType", value);
  };
  useEffect(() => {
    formik.setFieldValue("objective", inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);
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

  const removePill = (value: string) => {
    const newPills = pills.filter((pill) => pill !== value);
    setPills(newPills);
    formik.setFieldValue("objective", newPills.join(", "));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Object.keys(formik.values).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit(e);
      } else {
        console.log(errors);
        formik.setErrors(errors);
      }
    });
  };
  useEffect(() => {
    const savedInsurer = localStorage.getItem("selectedInsurer");
    if (savedInsurer) {
      formik.setFieldValue("insurer", savedInsurer);
    }
  }, []);

  return (
    <>
      <NavbarSection />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center md:px-6 sm:px-10 mt-40 md:mt-16"
      >
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-lg ">
          <p className="text-2xl sm:text-4xl mt-10 font-semibold text-[#333333]">
            Appointment Details
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We use this information to call the clinic and book your appointment
          </p>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-[#333333]">Patient name</Label>
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
              <Label className="text-[#333333]">Date of Birth </Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="MM/DD/YYYY"
                name="dob"
                className={
                  formik.errors.dob && formik.touched.dob
                    ? "border-red-500 rounded-none"
                    : "border border-[#333333] rounded-md"
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
                    const [month, day, year] = formattedInput.split("/");
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
              {formik.errors.dob && formik.touched.dob && (
                <div className="text-red-500 text-sm">{formik.errors.dob}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-[#333333]">Phone number</Label>
              <Input
                name="phoneNumber"
                type="tel"
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
              <p className="text-xs text-gray-500 mt-1">
                Appointment confirmation will be sent to this phone number.
              </p>
            </div>
          </div>
          <div
            className=" mb-20 text-[#E5573F] text-xs flex space-x-2 items-center cursor-pointer hover:underline"
            onClick={() => {
              // Save selected specialty before opening modal
              if (selectedSpecialty) {
                localStorage.setItem("selectedSpecialty", selectedSpecialty);
              }
              setIsModalOpen(true);
            }}
          >
            <p className="font-bold text-base underline">
              Add insurance and availability details
            </p>
            <ArrowRight className="hidden md:block" />
          </div>
          <div className="flex md:mt-12 my-6 w-full">
            <div className="w-full flex flex-col space-y-2 mb-3">
              <ul className="list-disc pl-4 space-y-1">
                <li className="text-xs text-gray-600">
                  We will confirm your insurance coverage (if provided) with the
                  doctor's office.
                </li>
                <li className="text-xs text-gray-600">
                  Your doctor has 1 hour to confirm.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex w-full">
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
                "Request to book"
              )}
            </Button>
          </div>
          <span className="text-[#333333BF] text-sm">
            By continuing, you authorize us to book an appointment on your
            behalf.
          </span>
        </div>
      </form>
      {/* Quick Details Modal */}
      <QuickDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialSpecialty={selectedSpecialty}
      />
      <FooterSection />
    </>
  );
}
