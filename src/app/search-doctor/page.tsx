//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { ChevronDown, LoaderCircle, MapPin, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "../lib/utils";

const validationSchema = Yup.object().shape({
  // objective: Yup.string().required("Required"),
});

export default function SearchDoctorPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptSummary, setTranscriptSummary] = useState({
    place_id: "",
    summary: "",
  });
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(true);
  const [insuranceType, setinsuranceType] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const mapRef = useRef(null);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedDoctors, setCheckedDoctors] = useState({});

  const distanceOptions = [
    "< 2 miles",
    "< 5 miles",
    "< 10 miles",
    "< 20 miles",
  ];
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [activeCallIndex, setActiveCallIndex] = useState(0);
  const activeCallIndexRef = useRef(activeCallIndex);

  useEffect(() => {
    activeCallIndexRef.current = activeCallIndex;
  }, [activeCallIndex]);

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    setPhoneNumbers(numbers);
  };

  const getTotalDoctorsList = async () => {
    setIsCountLoading(true);
    const savedSpecialty = localStorage.getItem("selectedSpecialty");
    const savedAddress = localStorage.getItem("selectedAddress");
    const addressParts = savedAddress?.split(",") || [];
    const cityName = addressParts
      .slice(-2)
      .join(",")
      .trim()
      .replace(/[0-9]/g, "");
    try {
      const response = await axios.get(
        `https://callai-backend-243277014955.us-central1.run.app/api/get_doctor_count?medical_speciality=${savedSpecialty}&area=${cityName}`
      );
      setIsCountLoading(false);
      if (response.data && response.data.total_doctors) {
        setTotalDoctorsCount(response.data.total_doctors);
        return response.data.total_doctors;
      } else {
        console.log("Invalid response format:", response.data);
        return "Could not fetch doctors count";
      }
    } catch (error) {
      setIsCountLoading(false);
      console.error("Error fetching doctors count:", error);
      return 0;
    } finally {
      setIsCountLoading(false);
    }
  };

  const logPatientData = async (updatedValues) => {
    const savedAddress = localStorage.getItem("selectedAddress");
    const data = {
      request_id: updatedValues.request_id,
      preferred_location: savedAddress,
    };
    console.log(data);
    try {
      const resp = await axios.put(
        `https://callai-backend-243277014955.us-central1.run.app/api/log-patientdata/${updatedValues.request_id}`,
        data
      );
      return;
    } catch (error) {
      return null;
    }
  };

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

  const loadMoreDoctors = async () => {
    console.log("loading more doctors...");
    if (!nextPageToken || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const savedSpecialty = localStorage.getItem("selectedSpecialty");
      const searchData = await JSON.parse(localStorage.getItem("searchData"));
      const lat = searchData?.lat || 0;
      const lng = searchData?.lng || 0;

      // Retrieve the fetch_open_now parameter from the last search
      let fetch_open_now = "false";
      const lastSearchSource = localStorage.getItem("lastSearchSource");
      const storageKey =
        lastSearchSource === "navbar" ? "statusDataNav" : "statusData";
      const previousSearchData = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );

      // Check if fetch_open_now was part of the previous search
      if (
        previousSearchData &&
        typeof previousSearchData.fetch_open_now !== "undefined"
      ) {
        fetch_open_now = previousSearchData.fetch_open_now;
      }

      const response = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/new_search_places",
        {
          location: `${lat},${lng}`,
          radius: 20000,
          keyword: savedSpecialty,
          next_page_token: nextPageToken,
          prev_page_data: doctors,
          fetch_open_now: fetch_open_now, // Include the fetch_open_now parameter
        }
      );

      if (response.data?.results) {
        const newDoctors = response.data.results.map((item) => ({
          ...item,
          id: item.place_id || item.id,
          location: {
            lat: item.location?.lat || item.lat,
            lng: item.location?.lng || item.lng,
          },
        }));

        // Create a combined array with existing and new doctors
        const updatedDoctors = [...doctors, ...newDoctors];

        // Update state
        setDoctors(updatedDoctors);
        setNextPageToken(response.data.next_page_token || null);

        const lastSearchSource = localStorage.getItem("lastSearchSource");
        const storageKey =
          lastSearchSource === "navbar" ? "statusDataNav" : "statusData";

        const currentData = JSON.parse(
          localStorage.getItem(storageKey) || "{}"
        );

        const updatedData = {
          ...currentData,
          results: [...(currentData.results || []), ...newDoctors],
          next_page_token: response.data.next_page_token || null,
        };

        localStorage.setItem(storageKey, JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Error loading more doctors:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !isLoadingMore) {
          loadMoreDoctors();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPageToken, isLoadingMore]);

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
      connectWebSocket();
    }

    fetchAndLogData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const updateDoctorsList = () => {
      try {
        const lastSearchSource = localStorage.getItem("lastSearchSource");
        let rawData;

        if (lastSearchSource === "navbar") {
          rawData = localStorage.getItem("statusDataNav");
        } else {
          rawData = localStorage.getItem("statusData");
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
            location: {
              lat: item.location?.lat || item.lat,
              lng: item.location?.lng || item.lng,
            },
          }));

          setDoctors(sortedData);
          setNextPageToken(parsedData.next_page_token || null);
        } else {
          console.warn("No valid results found in localStorage.");
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        setDoctors([]);
      }
      getTotalDoctorsList();
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

  useEffect(() => {
    try {
      const searchDataString = localStorage.getItem("searchData");
      if (searchDataString) {
        const searchData = JSON.parse(searchDataString);
        if (searchData && searchData.lat && searchData.lng) {
          setSelectedLocation({
            lat: searchData.lat,
            lng: searchData.lng,
          });
        }
      }
    } catch (error) {
      console.error("Error loading location from localStorage:", error);
    }
  }, []);

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
        name: `${doctor.name.replace(/^\d+\.\s*/, "")}`,
      })
    );

    setDoctors(newSortedDoctors);
  };

  useEffect(() => {
    if (doctors.length) {
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
      setIsLoading(true);
      track("Searchpage_Continue_Btn_Clicked");
      const savedSpecialty = localStorage.getItem("selectedSpecialty");
      const formData = JSON.parse(localStorage.getItem("formData"));

      // if (!values.objective || !values.objective.trim()) {
      //   toast.error("Please fill up all the required information");
      //   return;
      // }

      //console.log("Form values:", values);

      const updatedValues = {
        specialty: savedSpecialty,
        request_id: formData?.request_id,
      };
      logPatientData(updatedValues);

      localStorage.setItem("formData", JSON.stringify(updatedValues));

      setTimeout(() => {
        router.push("/appointment");
      }, 1500);
    },
  });

  // const handleFormSubmit = () => {
  //   // Touch all fields to trigger validation
  //   // formik.validateForm().then((errors) => {
  //   //   // If there are validation errors
  //   //   if (Object.keys(errors).length > 0) {
  //   //     // Set all fields as touched to show validation errors
  //   //     const touchedFields = {};
  //   //     Object.keys(formik.values).forEach((key) => {
  //   //       touchedFields[key] = true;
  //   //     });
  //   //     formik.setTouched(touchedFields);

  //   //     // Show toast error
  //   //     toast.error("Please fill up all the required information");
  //   //     return;
  //   //   }

  //   //   // If no errors, submit the form
  //   //   formik.handleSubmit();
  //   // });
  // formik.handleSubmit();
  // };

  //this one moves it to the top before switching to next page but booking shows

  const handleFormSubmit = async (index: number) => {
    // Move the selected doctor to the top of the list
    const newDoctors = [...doctors];
    const selectedDoctor = newDoctors.splice(index, 1)[0]; // Remove the selected doctor
    newDoctors.unshift(selectedDoctor); // Add the selected doctor to the top

    // Update the state with the new order
    setDoctors(newDoctors);

    // Update localStorage with the new order
    const lastSearchSource = localStorage.getItem("lastSearchSource");
    const storageKey =
      lastSearchSource === "navbar" ? "statusDataNav" : "statusData";

    const currentData = JSON.parse(localStorage.getItem(storageKey) || "{}");

    const updatedData = {
      ...currentData,
      results: newDoctors,
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    formik.handleSubmit();

    // Simulate form submission delay
    return new Promise((resolve) => setTimeout(resolve, 3000));
  };
  // const handleFormSubmit = async (index: number) => {
  //   // Keep the doctors list as is in the UI
  //   const newDoctors = [...doctors];

  //   // Update localStorage with the selected doctor moved to the top
  //   const selectedDoctor = newDoctors.splice(index, 1)[0]; // Remove the selected doctor
  //   newDoctors.unshift(selectedDoctor); // Add the selected doctor to the top

  //   // Perform form submission
  //   formik.handleSubmit();

  //   // Wait for navigation to complete
  //   setTimeout(() => {
  //     // Update localStorage after navigation
  //     const lastSearchSource = localStorage.getItem("lastSearchSource");
  //     const storageKey =
  //       lastSearchSource === "navbar" ? "statusDataNav" : "statusData";

  //     const currentData = JSON.parse(localStorage.getItem(storageKey) || "{}");

  //     const updatedData = {
  //       ...currentData,
  //       results: newDoctors, // Update with the reordered list
  //     };

  //     localStorage.setItem(storageKey, JSON.stringify(updatedData));
  //   }, 1500); // Delay to ensure navigation is complete
  // };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });

  const center = {
    lat: 6.453056,
    lng: 3.395833,
  };

  const ratings = [5, 4, 3, 2, 1];
  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
    setIsRatingOpen(false);
  };

  const handleSelectDistance = (distance: string) => {
    setSelectedDistance(distance);
    setIsDistanceOpen(false);
  };
  const connectWebSocket = async () => {
    const formData = await JSON.parse(localStorage.getItem("formData"));
    const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/notifications/${formData?.request_id}`;
    console.log(url);
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully and opened.");
    };

    wsRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "summary_stream" && message.data?.summary) {
        setTranscriptLoading(false);
        setTranscriptSummary(message.data);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current.onerror = (error) => {
      console.log("Retrying WebSocket connection in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  };
  const DrCount = useMemo(() => {
    const drVal = parseInt(totalDoctorsCount);
    if (drVal > 50) {
      return drVal + "+";
    } else if ((drVal < 50 || isNaN(drVal)) && !nextPageToken) {
      return doctors.length + "+";
    } else {
      return "50+";
    }
  }, [doctors.length, totalDoctorsCount, nextPageToken]);

  useEffect(() => {
    const newChecked = {};

    doctors.slice(0, 10).forEach((doc) => {
      if (doc.opening_hours?.open_now) {
        newChecked[doc.id] = true;
      }
    });

    setCheckedDoctors(newChecked);
  }, [doctors]);

  return (
    <section className="h-screen flex flex-col overflow-hidden">
      <NavbarSection />
      {doctors.length === 0 ? (
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
      ) : (
        <form
          className="flex flex-col flex-grow overflow-hidden"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex justify-between md:mt-24 mt-44 px-4 md:py-2 py-3  border-t-0 text-sm h-[60px] shrink-0">
            <div className="flex gap-2 items-center">
              <Image
                src="/Group 198.svg"
                alt="Verified Logo"
                width={0}
                height={0}
                className="w-5 h-auto"
              />
              <p>{DrCount} verified doctors in your area</p>
            </div>

            {/* "View Map" button on mobile */}
            <button
              type="button"
              onClick={() => setIsMapView(!isMapView)} // Toggle map view on click
              className="text-[#E5573F] underline md:hidden block text-sm cursor-pointer"
            >
              {isMapView ? "Back to List" : "View Map"}{" "}
              {/* Toggle button text */}
            </button>

            {/* <p className="text-[#E5573F] hidden md:block">
            Tip: You can re-arrange the priority by dragging list items
          </p> */}
          </div>

          <div className="flex flex-grow overflow-hidden">
            {/* Table view */}
            <div
              className={`md:w-[65%] w-full ${
                isMapView ? "hidden md:block" : "block"
              }`}
            >
              {/* <div className="md:flex hidden justify-between px-4 py-2 text-sm items-center">
                <div className="flex gap-2">
                  Docsure AI will call top-rated doctors in this sequence, seek
                  an appointment for you, and enquire about insurance.
                  <Button
                    className="bg-[#E5573F] text-white rounded-md"
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Booking..." : "Book appointment"}
                  </Button>
                </div>
              </div> */}
              {/* <div className="flex md:hidden px-2 py-2 text-sm items-center border">
                <div className="flex items-center space-x-2 border rounded-full py-2 px-4">
                  <Checkbox
                    id="open-now"
                    onCheckedChange={(value) => setIsNewPatient(value)}
                    className=""
                  />
                  <Label htmlFor="open-now" className="font-medium ">
                    Open Now
                  </Label>
                </div>
                <div className="flex gap-2 pl-2">
                  <DropdownMenu onOpenChange={(open) => setIsRatingOpen(open)}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex items-center justify-between gap-2 px-4 py-2 rounded-full border w-auto",
                          isRatingOpen
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        )}
                      >
                        <span>
                          {selectedRating
                            ? `${selectedRating} Stars`
                            : "Rating"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            isRatingOpen && "rotate-180 transition-transform"
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-60 py-2 px-4 space-y-2">
                      {ratings.map((rating) => (
                        <DropdownMenuItem
                          key={rating}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-black hover:text-white",
                            selectedRating === rating && "bg-black text-white"
                          )}
                          onSelect={(e) => {
                            e.preventDefault();
                            setSelectedRating(rating);
                            setIsRatingOpen(false); // Close on select
                          }}
                        >
                          <Checkbox
                            checked={selectedRating === rating}
                            onCheckedChange={() => {
                              setSelectedRating(rating);
                              setIsRatingOpen(false); // Close on check
                            }}
                            className="rounded-sm pointer-events-none"
                          />
                          <Label className="flex items-center gap-1 cursor-pointer">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill="#FFA703"
                                stroke="#FFA703"
                              />
                            ))}
                          </Label>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu onOpenChange={setIsDistanceOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex items-center justify-between gap-2 w-32 px-4 py-2 rounded-full border",
                          isDistanceOpen
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        )}
                      >
                        <span>{selectedDistance || "Distance"}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            isDistanceOpen && "rotate-180 transition-transform"
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44 mt-2 rounded-md py-2 shadow-md">
                      {distanceOptions.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-black hover:text-white",
                            selectedDistance === option && "bg-black text-white"
                          )}
                          onSelect={(e) => {
                            e.preventDefault();
                            handleSelectDistance(option);
                          }}
                        >
                          <Checkbox
                            checked={selectedDistance === option}
                            onCheckedChange={() => handleSelectDistance(option)}
                            className="pointer-events-none rounded-sm"
                          />
                          <span className="text-sm">{option}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div> */}
              <DndContext
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
              >
                <ScrollArea className="h-[100%] w-full md:w-auto pb-14 md:pb-0 pt-4 md:pt-0 overflow-y-auto">
                  <div className="flex flex-col md:flex-row w-full">
                    <Column
                      activeCallIndex={activeCallIndex}
                      tasks={doctors}
                      onDelete={handleDelete}
                      isDraggable={!isConfirmed}
                      callStatus={callStatus}
                      transcriptSummary={transcriptSummary}
                      setTranscriptSummary={setTranscriptSummary}
                      transcriptLoading={transcriptLoading}
                      setTranscriptLoading={setTranscriptLoading}
                      isAppointmentBooked={isAppointmentBooked}
                      wsRef={wsRef}
                      reconnectWebSocket={connectWebSocket}
                      handleFormSubmit={handleFormSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                  {/* Loading indicator for infinite scrolling */}
                  <div
                    ref={loadMoreRef}
                    className="w-full py-4 flex justify-center"
                  >
                    {isLoadingMore && (
                      <LoaderCircle className="w-6 h-6 text-gray-500 animate-spin" />
                    )}
                    {/* {!nextPageToken && doctors.length > 0 && 
                    <p className="text-sm text-gray-500">No more doctors to load</p>
                  } */}
                  </div>
                </ScrollArea>
              </DndContext>
            </div>

            {/* Map view */}
            <div
              className={`md:w-[35%] w-full h-screen relative px-4 md:px-0 ${
                isMapView ? "block" : "hidden"
              } md:block`}
            >
              {/* Google Map (visible only on mobile when map view is true) */}
              {!isLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <LoaderCircle className="w-8 h-8 text-gray-500 animate-spin" />
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={selectedLocation || center}
                  zoom={9}
                  onLoad={(map) => {
                    mapRef.current = map;

                    const bounds = new window.google.maps.LatLngBounds();

                    if (selectedLocation) {
                      bounds.extend(selectedLocation);
                    }

                    doctors.slice(0, 10).forEach((doctor) => {
                      if (doctor.location?.lat && doctor.location?.lng) {
                        bounds.extend({
                          lat: doctor.location.lat,
                          lng: doctor.location.lng,
                        });
                      }
                    });

                    if (!bounds.isEmpty()) {
                      map.fitBounds(bounds);
                    }
                  }}
                  options={{ disableDefaultUI: true, zoomControl: true }}
                >
                  {/* Blue "You" Marker */}
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                      title="Your Location"
                      icon={{
                        url: "/YouPin.svg", // Path relative to public/
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )}

                  {/* Doctor Markers with clickable popups */}
                  {doctors.slice(0, 10).map((doctor, index) => {
                    const position = {
                      lat: doctor.location?.lat || 0,
                      lng: doctor.location?.lng || 0,
                    };

                    return (
                      <Marker
                        key={doctor.id || index}
                        position={position}
                        icon={{
                          url: "/LocationPin.svg", // Path relative to public/
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                        onClick={
                          () => setActiveDoctor({ ...doctor, position, index }) // 👈 add index here
                        }
                      />
                    );
                  })}

                  {/* InfoWindow for selected doctor */}
                  {activeDoctor && (
                    <InfoWindow
                      position={activeDoctor.position}
                      onCloseClick={() => setActiveDoctor(null)}
                    >
                      <div className="text-sm  flex flex-col items-start space-y-1 min-w-48 max-w-48 w-auto ">
                        <p className="font-semibold">{activeDoctor.name}</p>
                        <div className="flex  items-center gap-2 ">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                            className="object-contain w-3 rounded-sm"
                            alt="Rating star"
                          />
                          <span className="whitespace-nowrap">
                            {activeDoctor.rating !== undefined
                              ? activeDoctor.rating
                              : "-"}
                          </span>
                          <span>•</span>
                          <span className="whitespace-nowrap underline">
                            {activeDoctor.user_ratings_total || 0} reviews
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={13} />
                          <span className="whitespace-nowrap text-[#333333] text-sm pb-2">
                            {activeDoctor.distance || "-"}
                          </span>
                        </div>
                        <div className="flex gap-1 items-center border-t pt-3 w-full">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <div className="relative w-6 h-6">
                              {/* <input type="checkbox" checked={true} /> */}

                              <input
                                type="checkbox"
                                checked={
                                  checkedDoctors[activeDoctor.id] || false
                                }
                                onChange={(e) => {
                                  const newChecked = e.target.checked;
                                  setCheckedDoctors((prev) => ({
                                    ...prev,
                                    [activeDoctor.id]: newChecked,
                                  }));
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="appearance-none w-full h-full bg-white border border-gray-300 rounded-md 
    checked:bg-[#00BA85] checked:border-transparent"
                              />

                              {/* White checkmark */}
                              {checkedDoctors[activeDoctor.id] && (
                                <svg
                                  className="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </label>
                          <span className=" ">Keep in Queue</span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  <DistanceMatrixService
                    options={{
                      origins: [
                        selectedLocation || { lat: 6.453056, lng: 3.395833 },
                      ],
                      destinations: doctors.slice(0, 10).map((doctor) => ({
                        lat: doctor.location?.lat || 0,
                        lng: doctor.location?.lng || 0,
                      })),
                      travelMode: "DRIVING",
                    }}
                    callback={(response) => {
                      // You can use this data for showing distance etc.
                    }}
                  />
                </GoogleMap>
              )}
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
