//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { BookText, Loader2, MapPin, Search } from "lucide-react";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Autocomplete } from "../../../components/ui/autocomplete";
import {
  insuranceCarrierOptions,
  medicalSpecialtiesOptions,
} from "@/constants/store-constants";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const addressRefs = useRef([]);
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("selectedAddress");
      const temp_sepciality = localStorage.getItem("selectedSpecialty");
      const storedLocation = localStorage.getItem("selectedLocation");

      if (savedAddress) {
        formik.setFieldValue("address", savedAddress);
      }
      if (temp_sepciality) {
        formik.setFieldValue("specialty", temp_sepciality);
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
    // validationSchema,
    onSubmit: async (values) => {
      updatePreferences && setIsPreferencesReinitialized(false);

      if (!formik.isValid) {
        toast.error("Please fill up all the required information");
        return;
      }

      setIsLoading(true);

      const updatedValues = {
        ...values,
      };

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

            // If address or specialty changed, refetch doctor lists
            if (addressChanged || specialtyChanged) {
              console.log("address or speciality changed");
              updatePreferences && setIsPreferencesReinitialized(true);
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
          onClose(false);
          confirmUpdatePreferences();
        } else {
          onClose(false);
          // router.push("/transcript?confirmed=true");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
        onClose(false); // Close modal
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });
  // Handle medical specialty change
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:hidden">
        <DialogHeader>
          <DialogTitle>Search Doctors</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 w-full bg-white rounded-md border border-black p-2">
          {/* Specialty Input */}
          <div className="flex items-center w-full">
            <Search className="w-5 h-5 text-gray-500 mx-2" />
            <div className="flex-1">
              <Autocomplete
                id="specialty"
                name="specialty"
                className="w-full"
                options={medicalSpecialtiesOptions}
                placeholder="Medical specialty"
                selected={initialSpecialty || formik.values.specialty}
                onChange={handleSpecialtyChange}
                clearable={false}
                // navbar
                // enabled={!updatePreferences}
              />
            </div>
          </div>

          {/* Insurer Input */}
          <div className="flex items-center w-full">
            <BookText className="w-5 h-5 text-gray-500 mx-2" />
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
          </div>

          {/* Location Input */}
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
          )}

          {/* Search Button */}
          <Button
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 w-full"
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
      </DialogContent>
    </Dialog>
  );
}
