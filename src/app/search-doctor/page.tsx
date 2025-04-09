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
  useMemo,
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
  InfoWindow,
} from "@react-google-maps/api";
import { ChevronDown, LoaderCircle, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "../lib/utils";
// import { GOOGLE_MAP_API_KEY } from "@/constants/global";
const validationSchema = Yup.object().shape({
  objective: Yup.string().required("Required"),
});
const availabilityOptions = [{ value: "yes", label: "Available anytime" }];
const distanceOptions = ["< 2 miles", "< 5 miles", "< 10 miles", "< 20 miles"];
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
  const [transcriptSummary, setTranscriptSummary] = useState({place_id:'', summary: ''});
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [customAvailability, setCustomAvailability] = useState("");
  const [timeOfAppointment, settimeOfAppointment] = useState("few days");
  const [insuranceType, setinsuranceType] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [hoveredDoctor, setHoveredDoctor] = useState(null);
  const [isMapView, setIsMapView] = useState(false);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
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
  const getTotalDoctorsList = async () => {
    setIsCountLoading(true);
    const savedSpecialty = sessionStorage.getItem("selectedSpecialty");
    const savedAddress = sessionStorage.getItem("selectedAddress");
    const addressParts = savedAddress?.split(',') || [];
    const cityName = addressParts.slice(-2).join(',').trim().replace(/[0-9]/g, '');
    try {
      const response = await axios.get(
        `https://callai-backend-243277014955.us-central1.run.app/api/get_doctor_count?medical_speciality=${savedSpecialty}&area=${cityName}`
      );
      // console.log("Response:", response);
      setIsCountLoading(false);
      if (response.data && response.data.total_doctors) {
        setTotalDoctorsCount(response.data.total_doctors);
        // if(response.data.total_doctors > 0) {
        //   console.log("Total doctors count:", response.data.total_doctors);
        // } else {
        //   setIsConfirmed(false);
        //   toast.info(response.data.total_doctors);
        // }
        return response.data.total_doctors;
      } else {
        console.log("Invalid response format:", response.data);
        return 'Could not fetch doctors count';
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
   // console.log("Logging dr lists:", data);
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
    console.log('loading more doctors...')
    if (!nextPageToken || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const savedSpecialty = sessionStorage.getItem("selectedSpecialty"); 
      const searchData = await JSON.parse(sessionStorage.getItem("searchData"));
      // console.log(searchData)
      const lat = searchData?.lat || 0;
      const lng = searchData?.lng || 0;
      const response = await axios.post(
        'https://callai-backend-243277014955.us-central1.run.app/api/new_search_places',
        {
          location: `${lat},${lng}`,
          radius: 20000,  
          keyword: savedSpecialty,
          next_page_token: nextPageToken,
          prev_page_data: doctors, // Pass the current doctors list as prev_page_data
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

        setDoctors(prevDoctors => [...prevDoctors, ...newDoctors]);
        setNextPageToken(response.data.next_page_token || null);
        
        // Store the updated data in session storage
        const lastSearchSource = sessionStorage.getItem("lastSearchSource");
        const storageKey = lastSearchSource === "navbar" ? "statusDataNav" : "statusData";
        
        // Get current data from storage
        const currentData = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
        
        // Merge new results with existing ones
        const updatedData = {
          ...currentData,
          results: [...(currentData.results || []), ...newDoctors],
          next_page_token: response.data.next_page_token || null
        };
        
        sessionStorage.setItem(storageKey, JSON.stringify(updatedData));
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
      connectWebSocket();
    }

    fetchAndLogData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            location: {
              lat: item.location?.lat || item.lat,
              lng: item.location?.lng || item.lng,
            },
          }));

          setDoctors(sortedData);
          setNextPageToken(parsedData.next_page_token || null);
        } else {
          console.warn("No valid results found in sessionStorage.");
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        setDoctors([]);
      }
      getTotalDoctorsList()
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
    const formData = await JSON.parse(sessionStorage.getItem("formData"));
    const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/notifications/${formData?.request_id}`;
    console.log(url);
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully and opened.");
    };
    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Message:", data);
      const message = JSON.parse(event.data);
      // console.log(message)
      if (message.event === 'summary_stream' && message.data?.summary) {
        setTranscriptLoading(false);
        setTranscriptSummary(message.data);
      }

    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current.onerror = (error) => {
      //console.error("WebSocket Error:", error);
      console.log("Retrying WebSocket connection in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  };

  // Calculate DrCount based on the conditions
  const DrCount = useMemo(() => {
    const drVal = parseInt(totalDoctorsCount)
    if(drVal > 50) {
      return drVal+"+";
    }
    else if ((drVal < 50 || isNaN(drVal))&& !nextPageToken) {
      return doctors.length+"+";
    } 
    // If there is a nextPageToken or totalDoctorsCount >= 50
    else {
      return "50+";
    }
    // If totalDoctorsCount is less than 50 and there is no nextPageToken
    
  }, [doctors.length, totalDoctorsCount, nextPageToken]);

  return (
    // <section>
    //   <NavbarSection />
    //   {/* {doctors?.length === 0 ? (
    //     <div className="flex flex-col items-center justify-center h-screen text-center ">
    //       <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
    //         No results found!
    //       </p>
    //       <p className="text-gray-500 mt-2">
    //         We could not find any doctors that meet this criteria.
    //       </p>
    //       <Link href="/">
    //         <Button className=" bg-[#7DA1B7] text-white px-6 py-5 mt-8 w-full sm:w-auto">
    //           Search Again
    //         </Button>
    //       </Link>
    //     </div>
    //   ) : ( */}
    //   <form className="">
    //     <div className="flex justify-between md:mt-24 mt-44 px-4 md:py-2 py-3 border border-t-0  border-b-1 text-sm">
    //       <div className="flex gap-2 items-center">
    //         <Image
    //           src="/Group 198.svg"
    //           alt="Verified Logo"
    //           width={0}
    //           height={0}
    //           className="w-5 h-auto"
    //         />
    //         <p>425 verified doctors in your area</p>
    //       </div>
    //       <p className="text-[#E5573F] underline md:hidden block text-sm">
    //         View Map
    //       </p>
    //       <p className="text-[#E5573F] hidden md:block">
    //         Tip: You can re-arrange the priority by dragging list items
    //       </p>
    //     </div>
    //     <div className="flex">
    //       <div className="md:w-[65%] w-full md:block">
    //         <div className="md:flex hidden justify-between px-4 py-2 text-sm items-center ">
    //           <p className="">
    //             Docsure AI will call the selected doctors in this sequence, seek
    //             an appointment for you, and enquire about insurance
    //           </p>
    //           <Button className="bg-[#E5573F] text-white rounded-md">
    //             Continue
    //           </Button>
    //         </div>

    // <div className="flex md:hidden px-2 py-2 text-sm items-center border">
    //   <div className="flex items-center space-x-2 border rounded-full py-2 px-4">
    //     <Checkbox
    //       id="open-now"
    //       onCheckedChange={(value) => setIsNewPatient(value)}
    //       className=""
    //     />
    //     <Label htmlFor="open-now" className="font-medium ">
    //       Open Now
    //     </Label>
    //   </div>
    //   <div className="flex gap-2 pl-2">
    //     {/* Rating Dropdown */}
    //     <DropdownMenu onOpenChange={(open) => setIsRatingOpen(open)}>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           variant="outline"
    //           className={cn(
    //             "flex items-center justify-between gap-2 px-4 py-2 rounded-full border w-auto",
    //             isRatingOpen
    //               ? "bg-black text-white"
    //               : "bg-white text-black"
    //           )}
    //         >
    //           <span>
    //             {selectedRating ? `${selectedRating} Stars` : "Rating"}
    //           </span>
    //           <ChevronDown
    //             size={16}
    //             className={cn(
    //               isRatingOpen && "rotate-180 transition-transform"
    //             )}
    //           />
    //         </Button>
    //       </DropdownMenuTrigger>

    //       <DropdownMenuContent className="w-60 py-2 px-4 space-y-2">
    //         {ratings.map((rating) => (
    //           <DropdownMenuItem
    //             key={rating}
    //             className={cn(
    //               "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-black hover:text-white",
    //               selectedRating === rating && "bg-black text-white"
    //             )}
    //             onSelect={(e) => {
    //               e.preventDefault();
    //               setSelectedRating(rating);
    //               setIsRatingOpen(false); // Close on select
    //             }}
    //           >
    //             <Checkbox
    //               checked={selectedRating === rating}
    //               onCheckedChange={() => {
    //                 setSelectedRating(rating);
    //                 setIsRatingOpen(false); // Close on check
    //               }}
    //               className="rounded-sm pointer-events-none"
    //             />
    //             <Label className="flex items-center gap-1 cursor-pointer">
    //               {Array.from({ length: rating }).map((_, i) => (
    //                 <Star
    //                   key={i}
    //                   size={16}
    //                   fill="#FFA703"
    //                   stroke="#FFA703"
    //                 />
    //               ))}
    //             </Label>
    //           </DropdownMenuItem>
    //         ))}
    //       </DropdownMenuContent>
    //     </DropdownMenu>

    //     {/* Distance Dropdown */}
    //     <DropdownMenu onOpenChange={setIsDistanceOpen}>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           variant="outline"
    //           className={cn(
    //             "flex items-center justify-between gap-2 w-32 px-4 py-2 rounded-full border",
    //             isDistanceOpen
    //               ? "bg-black text-white"
    //               : "bg-white text-black"
    //           )}
    //         >
    //           <span>{selectedDistance || "Distance"}</span>
    //           <ChevronDown
    //             size={16}
    //             className={cn(
    //               isDistanceOpen && "rotate-180 transition-transform"
    //             )}
    //           />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent className="w-44 mt-2 rounded-md py-2 shadow-md">
    //         {distanceOptions.map((option) => (
    //           <DropdownMenuItem
    //             key={option}
    //             className={cn(
    //               "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-black hover:text-white",
    //               selectedDistance === option && "bg-black text-white"
    //             )}
    //             onSelect={(e) => {
    //               e.preventDefault();
    //               handleSelectDistance(option);
    //             }}
    //           >
    //             <Checkbox
    //               checked={selectedDistance === option}
    //               onCheckedChange={() => handleSelectDistance(option)}
    //               className="pointer-events-none rounded-sm"
    //             />
    //             <span className="text-sm">{option}</span>
    //           </DropdownMenuItem>
    //         ))}
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   </div>
    // </div>

    //         <DndContext
    //           onDragEnd={handleDragEnd}
    //           collisionDetection={closestCenter}
    //         >
    //           <ScrollArea className="h-full w-full md:w-auto pb-14 md:pb-0 pt-4 md:pt-0">
    //             <div className="flex flex-col md:flex-row w-full">
    //               <Column
    //                 activeCallIndex={activeCallIndex}
    //                 tasks={doctors}
    //                 onDelete={handleDelete}
    //                 isDraggable={!isConfirmed}
    //                 callStatus={callStatus}
    //                 isAppointmentBooked={isAppointmentBooked}
    //               />
    //             </div>
    //           </ScrollArea>
    //         </DndContext>
    //       </div>

    //       {/* Parent div with h-screen */}
    //       <div className="md:w-[35%] w-full h-screen relative hidden md:block">
    //         {/* Parent div with h-screen */}
    //         {!isLoaded ? (
    //           <div className="flex items-center justify-center h-full">
    //             <LoaderCircle className="w-8 h-8 text-gray-500 animate-spin" />
    //           </div>
    //         ) : (
    //           <GoogleMap
    //             mapContainerStyle={{ width: "100%", height: "100%" }} // Full height for the map
    //             center={center}
    //             zoom={12}
    //             options={{ disableDefaultUI: true, zoomControl: true }}
    //           >
    //             {/* Marker for the inputted location */}
    //             {selectedLocation && (
    //               <Marker
    //                 position={selectedLocation}
    //                 title="Your Selected Location"
    //                 icon={{
    //                   url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for the inputted location
    //                 }}
    //               />
    //             )}

    //             {/* Markers for the first 10 doctors */}
    //             {doctors.slice(0, 10).map((doctor, index) => (
    //               <Marker
    //                 key={doctor.id || index}
    //                 position={{
    //                   lat: doctor.geometry?.location?.lat || 0,
    //                   lng: doctor.geometry?.location?.lng || 0,
    //                 }}
    //                 title={doctor.name || "Doctor Location"}
    //                 icon={{
    //                   url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom icon for doctors
    //                 }}
    //               />
    //             ))}

    //             {/* Add Distance Matrix Service */}
    //             <DistanceMatrixService
    //               options={{
    //                 origins: [
    //                   selectedLocation || { lat: 6.453056, lng: 3.395833 },
    //                 ],
    //                 destinations: doctors.slice(0, 10).map((doctor) => ({
    //                   lat: doctor.geometry?.location?.lat || 0,
    //                   lng: doctor.geometry?.location?.lng || 0,
    //                 })),
    //                 travelMode: "DRIVING",
    //               }}
    //               callback={(response) => {
    //                 console.log("Distance Matrix Response:", response);
    //               }}
    //             />
    //           </GoogleMap>

    //           //uncomment here to check the map pins
    //           // <GoogleMap
    //           //   mapContainerStyle={{ width: "100%", height: "100%" }}
    //           //   center={selectedLocation || center}
    //           //   zoom={12}
    //           //   options={{ disableDefaultUI: true, zoomControl: true }}
    //           // >
    //           //   {/* User Location Marker */}
    //           //   {selectedLocation && (
    //           //     <Marker
    //           //       position={selectedLocation}
    //           //       title="Your Location"
    //           //       icon={{
    //           //         url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    //           //       }}
    //           //       label={{
    //           //         text: "Me",
    //           //         color: "white",
    //           //         fontWeight: "bold",
    //           //       }}
    //           //     />
    //           //   )}

    //           //   {/* Doctor Markers */}
    //           //   {doctors.slice(0, 10).map((doctor, index) => {
    //           //     const latLngMatch =
    //           //       doctor?.geometry?.location || doctor?.location;
    //           //     const position = {
    //           //       lat: latLngMatch?.lat,
    //           //       lng: latLngMatch?.lng,
    //           //     };

    //           //     return (
    //           //       <Marker
    //           //         key={doctor.id || index}
    //           //         position={position}
    //           //         onMouseOver={() => setHoveredDoctor(doctor)}
    //           //         onMouseOut={() => setHoveredDoctor(null)}
    //           //         icon={{
    //           //           url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    //           //         }}
    //           //       >
    //           //         {hoveredDoctor?.id === doctor.id && (
    //           //           <InfoWindow position={position}>
    //           //             <div className="text-sm font-medium">
    //           //               <p>{doctor.name}</p>
    //           //               <p>{doctor.formatted_address}</p>
    //           //               <p>Rating: {doctor.rating} ⭐</p>
    //           //               <p>{doctor.phone_number}</p>
    //           //             </div>
    //           //           </InfoWindow>
    //           //         )}
    //           //       </Marker>
    //           //     );
    //           //   })}
    //           // </GoogleMap>
    //         )}
    //       </div>
    //     </div>
    //   </form>
    //   {/* )} */}
    // </section>
    <section>
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
        <form className="">
          <div className="flex justify-between md:mt-24 mt-44 px-4 md:py-2 py-3 border border-t-0 border-b-1 text-sm">
            <div className="flex gap-2 items-center">
              <Image
                src="/Group 198.svg"
                alt="Verified Logo"
                width={0}
                height={0}
                className="w-5 h-auto"
              />
              <p>425 verified doctors in your area</p>
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

          <div className="flex">
            {/* Table view */}
            <div
              className={`md:w-[65%] w-full ${
                isMapView ? "hidden md:block" : "block"
              }`}
            >
              <div className="md:flex hidden justify-between px-4 py-2 text-sm items-center">
                <p className="">
                  Docsure AI will call the selected doctors in this sequence,
                  seek an appointment for you, and enquire about insurance
                </p>
                <Link href="/contact">
                  <Button className="bg-[#E5573F] text-white rounded-md">
                    Continue
                  </Button>
                </Link>
              </div>
              <div className="flex md:hidden px-2 py-2 text-sm items-center border">
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
                  {/* Rating Dropdown */}
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

                  {/* Distance Dropdown */}
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
              </div>
              <DndContext
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
              >
                <ScrollArea className="h-full w-full md:w-auto pb-14 md:pb-0 pt-4 md:pt-0">
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
                  mapContainerStyle={{ width: "100%", height: "100%" }} // Full height for the map
                  center={center}
                  zoom={12}
                  options={{ disableDefaultUI: true, zoomControl: true }}
                >
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                      title="Your Selected Location"
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for the inputted location
                      }}
                    />
                  )}

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
      )}
    </section>
  );
}
