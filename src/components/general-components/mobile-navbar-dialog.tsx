//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { BookText, Loader2, MapPin, Search, X } from "lucide-react";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ReactModal from "react-modal";
import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";
import axios from "axios";
import Select from "../ui/client-only-select";

// Set the app element for accessibility - moved out of component to avoid React hooks rules issues
if (typeof window !== "undefined") {
  // In Next.js, we use document.body as a reliable app element
  ReactModal.setAppElement(document.body);
}
export const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "none",
    borderRadius: "0.5rem",
    minHeight: "40px",
    fontSize: "16px",
    padding: "2px 4px",
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
interface MobileNavbarDialogProps {
  isOpen: boolean;
  onClose: any;
  updatePreferences: any;
  confirmUpdatePreferences: any;
  initialSpecialty: any;
  setispreferencesUpdated: any;
  setIsPreferencesReinitialized: any;
}

export default function MobileNavbarDialog({
  isOpen,
  onClose,
  updatePreferences = false,
  confirmUpdatePreferences,
  initialSpecialty = "",
  setispreferencesUpdated,
  setIsPreferencesReinitialized,
}: MobileNavbarDialogProps) {
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
      maxWidth: "lg",
      width: "90%",
      maxHeight: "90vh",
      padding: "1.5rem",
      borderRadius: "0.5rem",
      backgroundColor: "#fff",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      overflow: "auto",
      marginTop: "1rem",
      "@media (minWidth: 768px)": {
        display: "none",
      },
    },
  };

  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const addressRefs = useRef([]);
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDCPbnPb43gQZDPT5dpq10a3dOP3EMHw-0",
    libraries: ["places"],
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("selectedAddress");
      const temp_sepciality = localStorage.getItem("selectedSpecialty");
      const storedLocation = localStorage.getItem("selectedLocation");
      const selectedInsurer = localStorage.getItem("selectedInsurer");
      if (temp_sepciality) {
        formik.setFieldValue("specialty", temp_sepciality);
      }
      if (savedAddress) {
        formik.setFieldValue("address", savedAddress);
      }
      if (selectedInsurer) {
        formik.setFieldValue("insurer", selectedInsurer);
      }
      if (storedLocation) {
        const { lat, lng } = JSON.parse(storedLocation);
        setSelectedLocation({ lat, lng });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const formik = useFormik({
    initialValues: {
      address: "",
      insurer: "",
      insuranceType: "",
      specialty: initialSpecialty,
    },
    onSubmit: async (values) => {
      // console.log(values);
      track("Navbar_Search_Btn_Clicked");
      const updatedValues = { ...values };

      setIsLoading(true);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        localStorage.setItem(
          "searchData",
          JSON.stringify({ lat, lng, specialty: values.specialty })
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

        localStorage.setItem("formDataNav", JSON.stringify(updatedValues));
        localStorage.setItem("statusData", JSON.stringify(response.data));
        localStorage.setItem("lastSearchSource", "navbar"); // Track last search source

        window.dispatchEvent(new Event("storage"));

        //console.log("Form Data:", values);
        //console.log("API Response Data:", response.data);
        setIsLoading(false);
        onClose(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error submitting form:", error);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSpecialtyChange = (value) => {
    formik.setFieldValue("specialty", value);
    formik.setFieldTouched("specialty", true);
    localStorage.setItem("selectedSpecialty", value);
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
        localStorage.setItem("selectedAddress", address?.formatted_address);
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
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      style={customStyles}
      contentLabel="Search Doctors"
      closeTimeoutMS={300}
      className="md:hidden"
    >
      <div className="relative">
        <div className="flex items-center">
          <button
            className="absolute right-4 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => onClose(false)}
          >
            <X className="h-5 w-6" />
            <span className="sr-only">Close</span>
          </button>

          <div className="mb-6">
            <h2 className="text-xl pr-12 font-bold">Search Doctors</h2>
          </div>
        </div>

        <div className="flex flex-col w-full bg-white rounded-md border border-black p-2">
          <div className="flex items-center w-full">
            <Search className="w-5 h-5 text-gray-500 mx-2" />
            <div className="flex-1 border-gray-400 md:border-none">
              <Select
                id="specialty"
                name="specialty"
                styles={customSelectStyles}
                className="w-full"
                options={medicalSpecialtiesOptions}
                placeholder="Medical specialty"
                value={medicalSpecialtiesOptions.find(
                  (option) => option.value === formik.values.specialty
                )}
                onChange={(selectedOption) => {
                  formik.setFieldValue("specialty", selectedOption.value);
                }}
                isClearable={false}
              />
            </div>
          </div>

          <div className="flex items-center w-full">
            <BookText className="w-5 h-5 text-gray-500 mx-2" />
            <div className="flex-1">
              <Select
                id="insurer"
                name="insurer"
                styles={customSelectStyles}
                className={cn(
                  "w-full   border-gray-400 md:border-none",
                  formik.touched.insurer && formik.errors.insurer
                    ? "border-red-500"
                    : ""
                )}
                options={insuranceCarrierOptions}
                placeholder="Insurance carrier (optional)"
                value={insuranceCarrierOptions.find(
                  (option) => option.value === formik.values.insurer
                )}
                onChange={(selectedOption) => {
                  formik.setFieldValue("insurer", selectedOption.value);
                  formik.setFieldTouched("insurer", true);
                  localStorage.setItem("selectedInsurer", selectedOption.value);
                }}
                isClearable={false}
              />
              {formik.touched.insurer && formik.errors.insurer && (
                <div className="text-red-500 text-sm">
                  {formik.errors.insurer}
                </div>
              )}
            </div>
          </div>

          {!updatePreferences && (
            <div className="flex items-center w-full">
              <MapPin className="w-5 h-5 text-gray-500 mx-2" />
              <div className="flex-1">
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (addressRefs.current[0] = ref)}
                    onPlacesChanged={() => handleOnAddressChanged(0)}
                  >
                    <Input
                      className={
                        formik.errors.address && formik.touched.address
                          ? "border-red-500 rounded-none"
                          : "w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none text-ellipsis"
                      }
                      placeholder="Search address.."
                      value={formik.values.address}
                      onChange={(e) => {
                        formik.handleChange(e);
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
          )}

          <div className="mt-3 mb-2">
            <Button
              type="submit"
              disabled={isLoading || formik.isSubmitting}
              className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 w-full"
              onClick={formik.handleSubmit}
            >
              {isLoading || formik.isSubmitting ? (
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
    </ReactModal>
  );
}
