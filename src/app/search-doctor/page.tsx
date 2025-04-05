//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import Link from "next/link";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import axios from "axios";

import NavbarSection from "@/components/general-components/navbar-section";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Column from "./features/column";
import {
  DistanceMatrixService,
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
  OverlayViewF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LoaderCircle } from "lucide-react";
// import { GOOGLE_MAP_API_KEY } from "@/constants/global";
const validationSchema = Yup.object().shape({
  objective: Yup.string().required("Required"),
});
const availabilityOptions = [{ value: "yes", label: "Available anytime" }];
export default function SearchDoctorPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(true);
  const [customAvailability, setCustomAvailability] = useState("");
  const [timeOfAppointment, settimeOfAppointment] = useState("few days");
  const [insuranceType, setinsuranceType] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log(numbers)
    setPhoneNumbers(numbers);
  };
  const logPatientData = async (updatedValues) => {
    const savedAddress = sessionStorage.getItem("selectedAddress");
    const data = {
      request_id: updatedValues.request_id,
      preferred_location: savedAddress,
      new_patient: updatedValues.isNewPatient,
      time_of_appointment: updatedValues.timeOfAppointment,
      patient_availability: updatedValues.maxWait,
      medical_concerns: updatedValues.objective,
      member_id: updatedValues?.subscriberId ?? "",
      // insurer: updatedValues.insurer ?? "none",
      insurance_type: updatedValues?.insuranceType ?? "",
      group_number: updatedValues.groupId ?? "",
      has_insurance: !!updatedValues.insurer,
    };
    console.log(data);
    try {
      const resp = await axios.put(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-patientdata/${updatedValues.request_id}`,
        data
      );
      // console.log(resp)
      return;
    } catch (error) {
      // console.error('Error logging call details:', error);
      return null;
    }
  };
  const logDrLists = async (data) => {
    console.log("Logging dr lists:", data);
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
      const drsData = sessionStorage.getItem("statusData");
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      console.log(formData);
      if (drsData) {
        const parsedDrsData = JSON.parse(drsData);
        // console.log(parsedDrsData)
        const payload = {
          request_id: formData?.request_id,
          ...parsedDrsData,
        };
        //  console.log(payload)
        await logDrLists(payload);
      }
    }

    fetchAndLogData();
  }, []);
  useEffect(() => {
    const updateDoctorsList = () => {
      try {
        const lastSearchSource = sessionStorage.getItem("lastSearchSource");
        let rawData;

        if (lastSearchSource === "navbar") {
          rawData = sessionStorage.getItem("statusDataNav");
        } else {
          rawData = sessionStorage.getItem("statusData");
        }

        if (!rawData) {
          router.push("/");
          return;
        }

        const parsedData = JSON.parse(rawData);
        if (parsedData?.results?.length) {
          const sortedData = parsedData.results.map((item) => ({
            ...item,
            id: item.place_id || item.id,
          }));

          setDoctors(sortedData);
        } else {
          console.warn("No valid results found in sessionStorage.");
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        setDoctors([]);
      }
    };

    // Initial load
    updateDoctorsList();

    // Listen for storage changes (detect when a new search is performed)
    const handleStorageChange = () => updateDoctorsList();
    window.addEventListener("storage", handleStorageChange);

    // Also detect route changes (e.g., navigating from home to search)
    const handleRouteChange = () => updateDoctorsList();
    router.events?.on("routeChangeComplete", handleRouteChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  const handleDelete = (id: string) => {
    setDoctors((prevDoctors) =>
      prevDoctors.filter((doctor) => doctor.id.toString() !== id)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = doctors.findIndex((doctor) => doctor.id === active.id);
    const newIndex = doctors.findIndex((doctor) => doctor.id === over.id);

    const newSortedDoctors = arrayMove(doctors, oldIndex, newIndex).map(
      (doctor, index) => ({
        ...doctor,
        name: `${doctor.name.replace(/^\d+\.\s*/, "")}`, // Renumber dynamically
      })
    );

    setDoctors(newSortedDoctors);
  };

  useEffect(() => {
    if (doctors.length) {
      // console.log(doctors)
      getPhoneNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors]);

  useEffect(() => {
    if (selectedInsurance === true) {
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("groupId", "");
      formik.setFieldValue("insurer", "");
      setinsuranceType("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsurance]);
  const formik = useFormik({
    initialValues: {
      specialty: "",
      objective: "",
      maxWait: "",
      availability: "",
      insurer: "",
      subscriberId: "",
      groupId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      track("Searchpage_Continue_Btn_Clicked");
      // console.log("here");
      const savedSpecialty = sessionStorage.getItem("selectedSpecialty");
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      // console.log("Objective value:", values.objective);

      if (!values.objective || !values.objective.trim()) {
        toast.error("Please fill up all the required information");
        return;
      }

      //console.log("Form values:", values);

      const updatedValues = {
        groupId: values.groupId,
        subscriberId: values.subscriberId,
        objective: values.objective,
        insurer: values.insurer, // formData?.insurance_carrier
        selectedOption: selectedInsurance === true ? "no" : "yes",
        availability: customAvailability
          ? customAvailability
          : availabilityOptions[0].label,
        specialty: savedSpecialty,
        timeOfAppointment,
        insuranceType,
        maxWait: timeOfAppointment,
        isNewPatient: isNewPatient ? "yes" : "no",
        request_id: formData?.request_id,
      };
      // console.log(updatedValues)
      logPatientData(updatedValues);

      sessionStorage.setItem("formData", JSON.stringify(updatedValues));

      // console.log("Stored formData in sessionStorage:", updatedValues);

      // Redirect to search page
      setTimeout(() => {
        router.push("/contact");
      }, 500);
    },
  });

  // Add this function to handle manual submission with toast error
  const handleFormSubmit = () => {
    // Touch all fields to trigger validation
    formik.validateForm().then((errors) => {
      // If there are validation errors
      if (Object.keys(errors).length > 0) {
        // Set all fields as touched to show validation errors
        const touchedFields = {};
        Object.keys(formik.values).forEach((key) => {
          touchedFields[key] = true;
        });
        formik.setTouched(touchedFields);

        // Show toast error
        toast.error("Please fill up all the required information");
        return;
      }

      // If no errors, submit the form
      formik.handleSubmit();
    });
  };

  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
      }
    }
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A", // Replace with your API key
    libraries: ["places"], // Add any required libraries
  });

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 6.453056,
    lng: 3.395833,
  };

  return (
    <section>
      <NavbarSection />
      {/* {doctors?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            No results found!
          </p>
          <p className="text-gray-500 mt-2">
            We could not find any doctors that meet this criteria.
          </p>
          <Link href="/">
            <Button className=" bg-[#7DA1B7] text-white px-6 py-5 mt-8 w-full sm:w-auto">
              Search Again
            </Button>
          </Link>
        </div>
      ) : ( */}
      <form className="">
        <div className="flex justify-between md:mt-24 mt-52 px-4 py-2 border border-t-0  border-b-1 text-sm">
          <div className="flex gap-2">
            <Image
              src="/Group 198.svg"
              alt="Verified Logo"
              width={0}
              height={0}
              className="w-5 h-auto"
            />
            <p>425 verified doctors in your area</p>
          </div>

          <p className="text-[#E5573F] hidden md:block">
            Tip: You can re-arrange the priority by dragging list items
          </p>
        </div>
        <div className="flex">
          <div className="md:w-[65%] w-full md:block">
            <div className="flex justify-between px-4 py-2 text-sm items-center">
              <p className="whitespace-nowrap">
                Docsure AI will call the selected doctors in this sequence, seek
                an appointment for you, and enquire about insurance
              </p>
              <Button className="bg-[#E5573F] text-white rounded-md">
                Continue
              </Button>
            </div>
            <DndContext
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
            >
              <ScrollArea className="h-full w-full md:w-auto pb-14 md:pb-0">
                <div className="flex flex-col md:flex-row w-full">
                  <Column
                    activeCallIndex={activeCallIndex}
                    tasks={doctors}
                    onDelete={handleDelete}
                    isDraggable={!isConfirmed}
                    callStatus={callStatus}
                    isAppointmentBooked={isAppointmentBooked}
                  />
                </div>
              </ScrollArea>
            </DndContext>
          </div>

          {/* Parent div with h-screen */}
          <div className="md:w-[35%] w-full h-screen relative">
            {/* Parent div with h-screen */}
            {!isLoaded ? (
              <div className="flex items-center justify-center h-full">
                <LoaderCircle className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }} // Full height for the map
                center={center}
                zoom={12}
                options={{ disableDefaultUI: true, zoomControl: true }}
              >
                {/* Marker for the inputted location */}
                {selectedLocation && (
                  <Marker
                    position={selectedLocation}
                    title="Your Selected Location"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for the inputted location
                    }}
                  />
                )}

                {/* Markers for the first 10 doctors */}
                {doctors.slice(0, 10).map((doctor, index) => (
                  <Marker
                    key={doctor.id || index}
                    position={{
                      lat: doctor.geometry?.location?.lat || 0,
                      lng: doctor.geometry?.location?.lng || 0,
                    }}
                    title={doctor.name || "Doctor Location"}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom icon for doctors
                    }}
                  />
                ))}

                {/* Add Distance Matrix Service */}
                <DistanceMatrixService
                  options={{
                    origins: [
                      selectedLocation || { lat: 6.453056, lng: 3.395833 },
                    ],
                    destinations: doctors.slice(0, 10).map((doctor) => ({
                      lat: doctor.geometry?.location?.lat || 0,
                      lng: doctor.geometry?.location?.lng || 0,
                    })),
                    travelMode: "DRIVING",
                  }}
                  callback={(response) => {
                    console.log("Distance Matrix Response:", response);
                  }}
                />
              </GoogleMap>
            )}
          </div>
        </div>
      </form>
      {/* )} */}
    </section>
  );
}
