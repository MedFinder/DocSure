//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { ChatSection } from "./ChatSection";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { track } from "@vercel/analytics";
import NavbarSection from "@/components/general-components/navbar-section";
import FooterSection from "../landing/components/FooterSection";
import { DoctorCard, ExpandProvider } from "./DoctorCard";
import Column from "../search-doctor/features/column";
import Image from "next/image";
import QuickDetailsModal from "../landing/components/QuickDetailsModal";

const _doctors: Doctor[] = [
  {
    name: "Dr. Dhruv Markan, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/4d91e6494ce7a92e2283e151d5de88461cbac107177cfa9667ad7be0e14e7ffb?placeholderIfAbsent=true",
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York",
    status: "unavailable",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "calling",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "queue",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "queue",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  {
    name: "Dr. Igor Kletsman, MD",
    title: "Primary Care Doctor",
    image:
      "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
    isSponsored: true,
    rating: 4.52,
    reviews: 86,
    distance: "2.7 mi",
    address: "317 E 34th St - 317 E 34th St, New York, NY 10016",
    status: "available",
    waitTime: "Excellent wait time",
    appointments: "New patient appointments",
  },
  // Add other doctors here...
];

export default function Transcript() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  // console.log(apiKey);
  const wsRef = useRef<WebSocket | null>(null);
  const wsSummaryRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const [totalDoctorsCount, setTotalDoctorsCount] = useState("");
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [formData, setFormData] = useState();
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);
  const [activeCallIndex, setActiveCallIndex] = useState(0);
  const [isPreferencesUpdated, setIsPreferencesUpdated] = useState(false);
  const [isPreferencesReinitialized, setIsPreferencesReinitialized] =
    useState(false);

  const activeCallIndexRef = useRef(activeCallIndex);
  const requestIdRef = useRef(formData?.request_id);
  const callStatusRef = useRef(callStatus);
  const isPreferencesReinitializedRef = useRef(isPreferencesReinitialized);
  const [context, setcontext] = useState("");
  const [transcriptSummary, setTranscriptSummary] = useState({
    place_id: "",
    summary: "",
  });
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false); // Dialog for Modify Request
  const [openTerminateAndCallDialog, setOpenTerminateAndCallDialog] =
    useState(false); // Dialog for Terminate and Call Myself
  const [isTerminated, setIsTerminated] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track whether calls are paused
  const [openResumeDialog, setOpenResumeDialog] = useState(false); // Dialog for Resume Calling
  const [openPhoneNumberDialog, setOpenPhoneNumberDialog] = useState(false);
  const [openQuickDetailsModal, setOpenQuickDetailsModal] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [isError, setisError] = useState(false);
  const [doctorToRemove, setDoctorToRemove] = useState<number | null>(null);
  const isInitialMount = useRef(true);

  // Function to find the next available doctor with "Open" status
  const findNextOpenDoctor = (startIndex: number): number => {
    for (let i = startIndex; i < doctors.length; i++) {
      if (doctors[i]?.opening_hours?.status === "Open") {
        return i;
      }
    }
    return -1; // No open doctors found
  };

  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      // console.log(JSON.parse(storedFormData));
      setFormData(JSON.parse(storedFormData));
    }
  }, []);
  const pathname = usePathname();
  useEffect(() => {
    activeCallIndexRef.current = activeCallIndex;
  }, [activeCallIndex]);
  useEffect(() => {
    requestIdRef.current = formData?.request_id;
  }, [formData]);
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);
  useEffect(() => {
    isPreferencesReinitializedRef.current = isPreferencesReinitialized;
  }, [isPreferencesReinitialized]);

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log("doctors-numbers-up", numbers);
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
  useEffect(() => {
    const updateDoctorsList = () => {
      try {
        const lastSearchSource = localStorage.getItem("lastSearchSource");
        let rawData;

        if (lastSearchSource === "navbar") {
          setCallStatus({
            isInitiated: false,
            ssid: "",
            email: "",
          });
          setActiveCallIndex(0);
          setTranscriptArray([]);
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
          // const sortedData = parsedData.results.map((item, index) => {
          //   // Transform each Google Places API result into a Doctor type
          //   return {
          //     id: item.place_id || item.id, // Preserve the original id from place_id
          //     name: item.name || "Unknown Doctor",
          //     title: item.types?.includes("health")
          //       ? "Primary Care Doctor"
          //       : "Specialist",
          //     image: item.photos?.[0]?.photo_reference
          //       ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${apiKey}`
          //       : "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
          //     rating: item.rating || 0,
          //     reviews: item.user_ratings_total || 0,
          //     distance: item.distance || "Unknown distance",
          //     address: item.formatted_address || "Address unavailable",
          //     status: "queue", // Default status
          //     waitTime: "Excellent wait time", // Default wait time
          //     appointments: "New patient appointments", // Default appointment text
          //     phone_number: item.phone_number || null,
          //     location: {
          //       lat: item.location?.lat || item.lat,
          //       lng: item.location?.lng || item.lng,
          //    },
          //     place_id: item.place_id,
          //     vicinity: item.formatted_address || "",
          //     website: item.website || "",
          //     isSponsored: false, // Default not sponsored
          //     opening_hours: {
          //       status: item.opening_hours?.status || "",
          //       time_info: item.opening_hours?.time_info || "",
          //     },
          //   };
          // });
          console.log(sortedData);
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
    };
    // Initial load
    updateDoctorsList();
    // getTotalDoctorsList();

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
  }, [router, apiKey]);

  const handleDragEnd = (event) => {
    if (isConfirmed) return; // Prevent reordering if call sequence has started

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
  const fetchPhoneNumbers = async () => {
    const numbers = await Promise.all(
      doctors.map(async (doctor) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,opening_hours,reviews,geometry&key=${apiKey}&place_id=${doctor.place_id}`
          );

          // console.log("fetchPhone", response);
          return response.data.result.formatted_phone_number;
        } catch (error) {
          console.error(
            `Error fetching details for ${doctor.place_id}:`,
            error
          );
          return null;
        }
      })
    );
    console.log("Final phone numbers list:", numbers);
    setPhoneNumbers(numbers);
  };
  useEffect(() => {
    if (doctors.length) {
      // console.log(doctors)
      getPhoneNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors]);
  useEffect(() => {
    if (phoneNumbers.length > 0 && !callStatus.isInitiated && !isError) {
      if (isInitialMount.current || isPreferencesReinitializedRef.current) {
        console.log("✅ Phone numbers available, initiating call...");
        handleConfirmSequence();
        isInitialMount.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumbers]); // Still depends on phoneNumbers but only runs on initial mount

  const handleConfirmSequence = useCallback(
    async (formdata) => {
      console.log("handleConfirmSequence called");
      // initiate call
      try {
        // Check if patient_number exists
        // const currentFormData = formdata || formData;
        // if (!currentFormData?.phoneNumber) {
        //   setOpenQuickDetailsModal(false);
        //   // Phone number doesn't exist, show the dialog
        //   setTimeout(() => {
        //     setOpenPhoneNumberDialog(true);
        //   }, 15000);
        // }

        setIsConfirmed(true); // Disable button and dragging

        // Check if the first doctor's office is open
        if (doctors[activeCallIndex]?.opening_hours?.status !== "Open") {
          console.log(
            "First doctor's office is closed. Finding next open doctor..."
          );
          // toast.info("First doctor's office is closed. Finding next open doctor...");
          // Call moveToNextDoctor to find an open doctor
          moveToNextDoctor(
            null,
            activeCallIndex - 1, // Start from current index - 1 so moveToNextDoctor will check from current index
            requestIdRef?.current
          );
          return;
        }

        const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex]; // '+2348168968260'
        await initiateCall(
          firstDoctorPhoneNumber,
          doctors[activeCallIndex]?.name,
          requestIdRef?.current,
          formdata
        );
        return;
      } catch (error) {
        console.error("Error initiating call:", error);
        setIsConfirmed(false); // Re-enable button and dragging if there's an error
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [activeCallIndex, doctors, phoneNumbers]
  );
  //console.log(phoneNumbers.length);
  useEffect(() => {
    if (callStatus.isInitiated && callStatus.ssid && wsRef.current) {
      setShowTranscript(true);
      setTranscriptArray((prev) => [
        ...prev,
        `${
          isPreferencesUpdated && !isPreferencesReinitialized
            ? "Re-calling"
            : "Calling"
        } ${doctors[activeCallIndex]?.name} to seek an appointment\n`,
      ]);
      console.log("ws listener added for id:", callStatus?.ssid);
      if (wsRef.current.readyState !== WebSocket.OPEN) {
        console.log("WebSocket not in OPEN state:", wsRef.current.readyState);
        return;
      }
      try {
        wsRef.current.send(
          JSON.stringify({
            event: "start",
            transcription_id: callStatus.ssid,
          })
        );
        // console.log('WebSocket message sent successfully');
      } catch (error) {
        console.log("Failed to send WebSocket message:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus, wsRef]);
  const terminateRequest = () => {
    // sent ws event to cancel call
    // wsRef?.current?.close();
    setIsConfirmed(false);
    if (callStatus.ssid) {
      terminateCurrentCall(callStatus?.ssid);
    }
    setTimeout(() => {
      setCallStatus({
        isInitiated: false,
        ssid: "",
        email: "",
      });
    }, 500);
    setIsPaused(true); // Set paused state to true when terminating
  };
  const handleTerminateRequest = () => {
    if (isPaused) {
      // If already paused, show resume dialog
      setOpenResumeDialog(true);
    } else {
      // If active, show pause dialog
      setOpenDialog(true);
    }
  };

  const handleResumeRequest = () => {
    setOpenResumeDialog(true);
  };

  const confirmResumeCall = () => {
    track("Resume_Call_Btn_Clicked");
    setOpenResumeDialog(false);
    setIsPaused(false);

    // Get the current form data
    const currentStoredFormData = JSON.parse(
      localStorage.getItem("formData") || "{}"
    );

    // Find the next available doctor with open office hours
    const openDoctorIndex = findNextOpenDoctor(activeCallIndex);

    if (openDoctorIndex === -1) {
      toast.info(
        "No doctors with open offices available. Cannot resume calls."
      );
      return;
    }

    // Set the active call index to the next open doctor
    setActiveCallIndex(openDoctorIndex);

    // Re-initiate the call
    setTimeout(() => {
      const doctorPhoneNumber =
        phoneNumbers[openDoctorIndex] || doctors[openDoctorIndex]?.phone_number;
      if (doctorPhoneNumber) {
        initiateCall(
          doctorPhoneNumber,
          doctors[openDoctorIndex]?.name,
          requestIdRef.current,
          currentStoredFormData
        );
        setIsConfirmed(true);
        toast.success("Calls resumed successfully.");
      } else {
        toast.error("Could not get doctor's phone number. Please try again.");
      }
    }, 500);
  };
  const confirmTermination = () => {
    track("Terminate_Request_Btn_Clicked");
    terminateRequest();
    setIsTerminated(true);
    setOpenDialog(false);
    toast.success("Your request has been terminated successfully.");
  };
  const connectWebSocketSummary = async () => {
    const formData = await JSON.parse(localStorage.getItem("formData"));
    const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/notifications/${formData?.request_id}`;
    console.log(url, "summary socket url");
    wsSummaryRef.current = new WebSocket(url);

    wsSummaryRef.current.onopen = () => {
      console.log("Summary WebSocket connected successfully and opened.");
    };
    wsSummaryRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "summary_stream" && message.data?.summary) {
        setTranscriptLoading(false);
        setTranscriptSummary(message.data);
      }
    };

    wsSummaryRef.current.onclose = () => {
      console.log("Sumamry WebSocket disconnected");
    };

    wsSummaryRef.current.onerror = (error) => {
      console.log("Summary Retrying WebSocket connection in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  };
  const initiateCall = useCallback(
    async (
      doctorPhoneNumber: string,
      nameOfOrg: string,
      request_id?: string,
      customformdata?: any
    ) => {
      console.log(
        "new call initiated for",
        doctorPhoneNumber,
        nameOfOrg,
        request_id
      );
      // Use customformdata if available, otherwise use the state formData
      const currentFormData = customformdata || formData;
      const savedSpecialty = localStorage.getItem("selectedSpecialty");

      if (!currentFormData || !doctorPhoneNumber) {
        console.error(
          "No formData found in localStorage or provided as parameter."
        );
        return;
      }

      const {
        availability,
        email,
        phoneNumber,
        patientName,
        objective,
        subscriberId,
        groupId,
        selectedOption = "no",
        dob = "",
        address,
        selectedAvailability,
        timeOfAppointment,
        insuranceType,
        isnewPatient,
        gender,
        // zipcode,
        insurer,
        maxWait,
      } = currentFormData;

      let context =
        "Clinical concerns:" +
        (objective ? objective : `${savedSpecialty} consultation`) +
        "; " +
        "Patient has insurance:" +
        (!insurer ? "no" : selectedOption);

      if (insurer) context += `; Insurance Provider:${insurer}`;
      if (subscriberId) context += `; Member Id:"${subscriberId}"`;
      if (gender) context += `; Patient Gender:${gender}`;
      if (groupId) context += `; Group Number:${groupId}`;
      if (insuranceType) context += `; Insurance type:${insuranceType}`;
      if (dob) context += `; Date of birth:${dob}`;
      if (address) context += `; Address of the patient:${address}`;
      if (maxWait)
        context += `; Maximum wait time for the appointment:${maxWait} days. If an appointment is not available within ${maxWait} days , then do not take an appointment `;
      if (availability)
        context += `; Availability of the patient:${availability}`;
      if (isnewPatient) context += `; Is New Patient:${isnewPatient}`;
      // if (zipcode) context += `; Zipcode:${zipcode}`;

      const data = {
        request_id,
        objective: "Schedule an appointment",
        context: context,
        patient_number: phoneNumber || "510-902-8776",
        patient_name: patientName,
        hospital_name: nameOfOrg,
        patient_email: email || "Not Available",
        doctor_number: doctorPhoneNumber,
      };
      localStorage.setItem("context", context);
      console.log(data);
      try {
        const callResponse = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/assistant-initiate-call",
          data
        );
        track("Initiated_new_call_successfully");
        connectWebSocket(callResponse.data.call_id);
        setCallStatus({
          isInitiated: true,
          ssid: callResponse.data.call_id,
          email: email,
        });
        const updatedFormData = {
          ...formData,
          request_id,
          prompt: callResponse.data.prompt,
          voice_used: callResponse.data.voice_used,
          interruption_threshold: callResponse.data.interruption_threshold,
          temperature: callResponse.data.temperature,
          model: callResponse.data.model,
        };
        setFormData(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      } catch (error) {
        track("Initiated_new_call_failed");
        console.log(error, "error initiating bland AI");
        setisError(true);
        terminateRequest();
        toast.error(
          "We’re experiencing high traffic. Please try again shortly.",
          {
            duration: 20000,
          }
        );
      }
    },
    [formData]
  );
  const moveToNextDoctor = async (
    id: string,
    currentindex: number,
    request_id: string
  ) => {
    // console.log(id,currentindex,request_id)
    setIsPreferencesReinitialized(false);
    setIsPreferencesUpdated(false);
    let newIndex = currentindex + 1;
    if (id) {
      // wsRef?.current?.close(); // temp solution; disconnect websocket and connect to a new one
      terminateCurrentCall(id);
    }

    // Find next open doctor
    const nextOpenIndex = findNextOpenDoctor(newIndex);

    // If no open doctors found, end the process
    if (nextOpenIndex === -1) {
      terminateRequest();
      wsRef?.current?.close();
      toast.info(
        "No more available doctors with open offices. Request terminated."
      );
      setIsConfirmed(false);
      setCallStatus({
        isInitiated: false,
        ssid: "",
        email: "",
      });
      return;
    }

    // Set the active call index to the next open doctor
    setActiveCallIndex(nextOpenIndex);

    // If the next open doctor isn't the immediate next one, log which ones we're skipping
    if (nextOpenIndex > newIndex) {
      toast.info(
        `Skipping ${nextOpenIndex - newIndex} doctor(s) with closed offices`
      );
    }

    // Proceed with the next open doctor
    const nextDoctor = doctors[nextOpenIndex];
    const phoneNumber = phoneNumbers[nextOpenIndex] ?? nextDoctor?.phone_number;
    const nameOfOrg = nextDoctor?.name;

    if (phoneNumber) {
      await initiateCall(
        phoneNumber,
        nameOfOrg,
        request_id ?? requestIdRef?.current
      );
    } else {
      console.log("No phone number available for the next doctor.");
      toast.error("Next doctor has no phone number. Skipping...");
      // Try the next doctor
      moveToNextDoctor(
        null,
        nextOpenIndex,
        request_id ?? requestIdRef?.current
      );
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
  useEffect(() => {
    async function fetchAndLogData() {
      const drsData = localStorage.getItem("statusData");
      const formData = JSON.parse(localStorage.getItem("formData"));
      //console.log(formData);
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
    connectWebSocketSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const connectWebSocket = (id?: string) => {
    // Check if a WebSocket connection already exists
    if (wsRef?.current) {
      console.log("Reusing existing WebSocket connection...");
      return; // Exit if the WebSocket is already connected
    }

    const url = `wss://callai-backend-243277014955.us-central1.run.app/ws/notifications/${
      id ?? callStatusRef.current.ssid
    }`;
    console.log(url);
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully and opened.");
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      // Handle call-ended event
      if (data.event === "call_ended") {
        setTimeout(async () => {
          const call_ended_result = await handleEndCall(data?.call_sid);
          console.log({ call_ended_result });
          if (call_ended_result?.status === "yes") {
            const successMessage =
              call_ended_result?.confirmation_message ??
              "Appointment Booked Successfully";
            sendSMS(successMessage);
            const doctorPhone =
              doctors[activeCallIndexRef.current]?.phone_number;
            setIsAppointmentBooked(true);
            wsRef?.current?.close();

            router.push(
              `/success?success_message=${encodeURIComponent(
                successMessage
              )}&phone_number=${encodeURIComponent(doctorPhone || "")}`
            );
          } else {
            if (callStatusRef.current.ssid === data?.call_sid) {
              toast.warning(
                "Appointment could not be booked. Trying next doctor..."
              );
              moveToNextDoctor(
                null,
                activeCallIndexRef.current,
                formData.request_id
              );
            }
          }
        }, 5000);
      }

      // Handle call-in-process event
      if (data.event === "call_in_process") {
        if (callStatusRef.current.ssid === data?.call_sid) {
          setTranscriptArray((prev) => [...prev, `${data.transcription}`]);
        }
      }

      // Handle call-not-picked event
      if (data.event === "call_not_picked") {
        if (callStatusRef.current.ssid === data?.call_sid) {
          toast.info("Doctor did not pick call. Trying next doctor...");
          moveToNextDoctor(
            null,
            activeCallIndexRef.current,
            formData.request_id
          );
        }
      }

      // Handle summary_stream event
      if (data.event === "summary_stream" && data.data?.summary) {
        setTranscriptLoading(false); // Stop loading when summary is received
        setTranscriptSummary(data.data); // Update the transcript summary
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null; // Reset the WebSocket reference
    };

    wsRef.current.onerror = (error) => {
      console.log("Retrying WebSocket connection in 5 seconds...");
      setTimeout(() => connectWebSocket(id), 5000); // Retry connection after 5 seconds
    };
  };

  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      // console.log(transcriptArray)
      return transcriptArray;
    }
    return "Waiting for conversation to begin...";
  };
  const handleRemoveDoctor = (index: number) => {
    // Set the index of the doctor to remove and show the dialog
    setDoctorToRemove(index);
    setOpenRemoveDialog(true);
  };

  const confirmRemoveDoctor = () => {
    // Make sure doctorToRemove is not null
    if (doctorToRemove === null) return;

    const index = doctorToRemove;

    // Handle case where the doctor being removed is the active one with an ongoing call
    if (index === activeCallIndex && callStatus.isInitiated) {
      // Terminate the current call first
      terminateRequest();
      toast.info("Active call terminated and doctor removed from the list.");
    }

    // Clone the doctors array
    const newDoctors = [...doctors];

    // Remove the doctor at the specified index
    newDoctors.splice(index, 1);

    // Update the doctors array
    setDoctors(newDoctors);

    // If you're also storing the data in localStorage, update it there too
    const lastSearchSource = localStorage.getItem("lastSearchSource");
    const storageKey =
      lastSearchSource === "navbar" ? "statusDataNav" : "statusData";

    const currentData = JSON.parse(localStorage.getItem(storageKey) || "{}");

    const updatedData = {
      ...currentData,
      results: newDoctors,
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedData));

    // Close the dialog and reset the doctorToRemove
    setOpenRemoveDialog(false);
    setDoctorToRemove(null);
  };

  const toggleTranscript = () => {
    setShowTranscript((prev) => !prev);
  };
  const confirmModifyRequest = async () => {
    setOpenModifyDialog(false); // Close the dialog
    if (callStatus?.isInitiated) {
      try {
        await terminateCurrentCall(callStatus?.ssid);
        console.log("Call has been terminated successfully.");
      } catch (error) {
        console.error("Failed to log call termination:", error);
        toast.error("Failed to terminate the call. Please try again.");
        return;
      }

      terminateRequest();

      const savedAddress = localStorage.getItem("selectedAddress");
      const specialty = formData?.specialty;

      router.push("/appointment");
    }
  };
  const handleEndCall = useCallback(
    async (id: string, retries = 2): Promise<any> => {
      const index = activeCallIndexRef.current;
      // console.log('cuurentIndex',index)
      // const formData = JSON.parse(localStorage.getItem("formData"));
      const context = localStorage.getItem("context");
      const {
        email,
        phoneNumber,
        patientName,
        request_id,
        prompt,
        voice_used,
        interruption_threshold,
        temperature,
        model,
      } = formData;
      const data = {
        call_id: id,
        request_id: request_id ?? requestIdRef?.current,
        doctor_number: doctors[index]?.phone_number, // phoneNumbers[index]
        hospital_name: doctors[index]?.name,
        doctor_address: doctors[index]?.formatted_address,
        hospital_address: doctors[index]?.formatted_address,
        distance: doctors[index]?.distance,
        rating: doctors[index]?.rating?.toString(),
        hospital_rating: doctors[index]?.rating?.toString(),
        website: doctors[index]?.website,
        context,
        patient_name: patientName,
        patient_email: email || "Not Available",
        patient_number: phoneNumber || "510-902-8776",
        prompt: prompt ?? "Has the appointment been booked?",
        voice_used: voice_used ?? "Alex",
        interruption_threshold: interruption_threshold ?? 70,
        temperature: temperature ?? 0.7,
        model: model ?? "gpt-4-turbo",
      };
      // console.log(data, 'end call data');

      try {
        const resp = await axios.post(
          `https://callai-backend-243277014955.us-central1.run.app/api/appointment-booked-status`,
          data
        );
        return resp.data;
      } catch (error) {
        if (error.response && error.response.status === 500 && retries > 0) {
          console.log(
            `Retrying to end call in 5 seconds... (${retries} retries left)`
          );
          await new Promise((resolve) => setTimeout(resolve, 5000));
          return handleEndCall(id, retries - 1);
        }
        console.log(
          "Failed to end call after multiple attempts. Returning true."
        );
        return true;
      }
    },
    [doctors, formData]
  );
  const terminateCurrentCall = async (id: string): Promise<any> => {
    // console.log(id,'xxx')
    try {
      const resp = await axios.post(
        `https://callai-backend-243277014955.us-central1.run.app/api/terminate-call`,
        { call_id: id }
      );
      return resp.data;
    } catch (error) {
      // console.log("Error ending call:", error);
      return true;
    }
  };
  const confirmUpdatePreferences = async () => {
    console.log("confirming updated preferences........xxxx");
    setisError(false);
    try {
      await terminateRequest();
      console.log("Current Call has been terminated successfully.");
      // Modify handleConfirmSequence to use the latest form data from local storage
      const currentStoredFormData = JSON.parse(
        localStorage.getItem("formData") || "{}"
      );
      requestIdRef.current = currentStoredFormData?.request_id;
      setFormData(currentStoredFormData);
      if (!isPreferencesReinitializedRef.current) {
        console.log("fired from preferences reinitialization");
        handleConfirmSequence(currentStoredFormData);
      }
    } catch (error) {
      console.error("Failed to log call termination:", error);
      toast.error("Failed to terminate the call. Please try again.");
      return;
    }
  };

  const confirmTerminateAndCallMyself = async () => {
    setOpenTerminateAndCallDialog(false); // Close the dialog
    if (callStatus?.isInitiated) {
      try {
        await terminateCurrentCall(callStatus?.ssid);
        console.log("Call has been terminated successfully.");
      } catch (error) {
        console.error("Failed to log call termination:", error);
        toast.error("Failed to terminate the call. Please try again.");
        return;
      }

      terminateRequest();

      const currentDoctorPhoneNumber = doctors[activeCallIndex]?.phone_number;

      if (currentDoctorPhoneNumber) {
        window.location.href = `tel:${currentDoctorPhoneNumber}`;
      } else {
        toast.error("No phone number available for the current doctor.");
      }
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
      const storageKey = lastSearchSource === "navbar" ? "statusDataNav" : "statusData";
      const previousSearchData = JSON.parse(localStorage.getItem(storageKey) || "{}");
      
      // Check if fetch_open_now was part of the previous search
      if (previousSearchData && typeof previousSearchData.fetch_open_now !== "undefined") {
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

        // If there are no open doctors currently and we're not in an active call,
        // check if any of the newly loaded doctors have open offices
        if (!callStatus.isInitiated) {
          // Check if there are any open doctors in the original list
          const hasOpenDoctors = doctors.some(
            (doctor) => doctor.opening_hours?.status === "Open"
          );

          if (!hasOpenDoctors) {
            // Use the updatedDoctors array to search for open doctors
            const findNextOpenDoctorInList = (
              startIndex: number,
              doctorsList: any[]
            ): number => {
              for (let i = startIndex; i < doctorsList.length; i++) {
                if (doctorsList[i]?.opening_hours?.status === "Open") {
                  return i;
                }
              }
              return -1; // No open doctors found
            };

            // Check if any doctor in the updated list has an open office
            const openDoctorIndex = findNextOpenDoctorInList(0, updatedDoctors);
            if (openDoctorIndex !== -1) {
              toast.info(
                "Found available doctors with open offices! Starting calls..."
              );
              const foundInfo = updatedDoctors[openDoctorIndex];
              // console.log(foundInfo)
              setActiveCallIndex(openDoctorIndex);
              setTimeout(() => {
                const firstDoctorPhoneNumber = foundInfo.phone_number; // '+2348168968260'
                initiateCall(
                  firstDoctorPhoneNumber,
                  foundInfo?.name,
                  requestIdRef?.current
                );
              }, 500); // Small delay to ensure state updates have propagated
            }
          }
        }
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

  // Function to move a doctor to the next position in the queue
  const handleCallNext = (index: number) => {
    if (index === activeCallIndex || index < activeCallIndex) {
      return; // Don't move if it's the current active call or already processed
    }

    // Clone the doctors array
    const newDoctors = [...doctors];

    // Remove the doctor from their current position
    const doctorToMove = newDoctors.splice(index, 1)[0];

    // Insert the doctor right after the current active doctor
    newDoctors.splice(activeCallIndex + 1, 0, doctorToMove);

    // Update the doctors array
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
  };

  // const handleCall = () => {
  //   window.location.href = `tel:${+2348167238042}`;
  // };
  // console.log(transcriptSummary);
  // console.log(place_id);
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

  // Add cleanup effect to terminate request on component unmount
  useEffect(() => {
    // Return cleanup function that will run when component unmounts
    return () => {
      console.log("Component unmounting - terminating any active request");
      if (callStatus.isInitiated) {
        terminateRequest();
      }

      // Close WebSocket connections
      if (wsRef.current) {
        wsRef.current.close();
      }

      if (wsSummaryRef.current) {
        wsSummaryRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus.isInitiated]); // Re-create cleanup if call status changes

  return (
    <main className="flex flex-col bg-white h-screen overflow-hidden">
      <NavbarSection
        updatePreferences
        confirmUpdatePreferences={confirmUpdatePreferences}
        setIsPreferencesUpdated={setIsPreferencesUpdated}
        setIsPreferencesReinitialized={setIsPreferencesReinitialized}
      />
      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            No results found!
          </p>
          <p className="text-gray-500 mt-2">
            We could not find any doctors that meet this criteria.
          </p>
          <Link href="/">
            <Button className="bg-[#7DA1B7] text-white px-6 py-5 mt-8 w-full sm:w-auto">
              Search Again
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className=" w-full border border-solid border-black border-opacity-10 min-h-px max-md:max-w-full md:hidden mx-2 px-4 mt-16" />
          <div className="flex md:mt-24 mt-16 px-4 md:py-4 py-3 border-b text-sm h-[90%] w-full justify-between items-center">
            <div className="flex gap-2 items-center">
              <Image
                src="/Group 198.svg"
                alt="Verified Logo"
                width={0}
                height={0}
                className="w-5 h-auto"
              />
              {/* <p>{DrCount} verified doctors in your area</p> */}
              <p>
                {" "}
                Docsure AI is calling doctors in your area that accept your
                insurance, sorted by patient ratings. We'll notify you once your
                appointment is confirmed.
              </p>
            </div>

            {/* Mobile only "Back to List" / "View Transcript" button */}
            {/* <button
              onClick={toggleTranscript}
              className="text-sm text-[#E5573F] underline md:hidden"
            >
              {showTranscript ? "Back to List" : "View Transcript"}
            </button> */}
          </div>

          <section className="flex flex-col items-start px-7 w-full h-[95%] max-md:px-5 max-md:max-w-full ">
            {/* Info section with border bottom */}
            <div className="flex self-end justify-end pr-4 mb-2">
              <button
                onClick={toggleTranscript}
                className="text-sm text-[#E5573F] underline md:hidden self-end pt-4"
              >
                {showTranscript ? "Back to List" : "View Transcript"}
              </button>
            </div>
            <div className="self-stretch md:mt-2  flex-1 overflow-hidden max-md:max-w-full ">
              <div className="flex gap-5 h-full max-md:flex-col ">
                <div
                  className={`w-[68%] flex flex-col max-md:ml-0 max-md:w-full relative h-full  ${
                    showTranscript ? "hidden md:block" : "block"
                  }`}
                >
                  <div className="pr-2 h-[calc(100%-60px)] pt-3 relative ">
                    <ExpandProvider>
                      <ScrollArea className="h-full w-full md:w-auto ">
                        <Column
                          activeCallIndex={activeCallIndex}
                          tasks={doctors}
                          isDraggable={!isConfirmed}
                          callStatus={callStatus}
                          transcriptSummary={transcriptSummary}
                          setTranscriptSummary={setTranscriptSummary}
                          transcriptLoading={transcriptLoading}
                          setTranscriptLoading={setTranscriptLoading}
                          isAppointmentBooked={isAppointmentBooked}
                          wsRef={wsSummaryRef}
                          reconnectWebSocket={connectWebSocketSummary}
                          fromTranscript={true}
                          onSkip={() => {
                            track("Skip_Call_Btn_Clicked");
                            moveToNextDoctor(
                              callStatus?.ssid,
                              activeCallIndexRef.current,
                              formData.request_id
                            );
                          }}
                          onCallNext={handleCallNext}
                          handleRemoveDoctor={handleRemoveDoctor}
                        />
                        {/* Bottom spacer to make room for fixed buttons */}

                        <div
                          ref={loadMoreRef}
                          className="w-full py-4 flex justify-center"
                        >
                          {isLoadingMore && (
                            <LoaderCircle className="w-6 h-6 text-gray-500 animate-spin" />
                          )}
                        </div>
                        <div className="h-32" />
                      </ScrollArea>
                    </ExpandProvider>
                  </div>

                  {/* Terminate Request Button - fixed at bottom */}
                  {/* <div className="flex justify-center mt-4 pb-2">
                  <button
                    onClick={terminateRequest}
                    disabled={!callStatus?.isInitiated}
                    className={`font-medium py-2 px-8 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                      callStatus?.isInitiated
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-300 cursor-not-allowed text-white opacity-70"
                    }`}
                  >
                    Terminate Request
                  </button>
                </div> */}
                  {/* Floating Action Buttons */}
                  <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 bg-gradient-to-t from-white/90 to-transparent">
                    <div className="flex flex-row gap-4 justify-start md:justify-center overflow-x-auto whitespace-nowrap">
                      <button
                        onClick={handleTerminateRequest}
                        // disabled={!callStatus?.isInitiated}
                        className={`min-w-[250px] font-medium py-2 px-4 md:px-8 text-sm md:text-base rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                          isPaused
                            ? "bg-black hover:bg-black text-white" //"bg-[#0074BA] hover:bg-blue-600 text-white"
                            : "bg-black hover:bg-black text-white"
                        }`}
                      >
                        {isPaused ? "Resume Calling" : "Pause Calling"}
                      </button>
                      <button
                        onClick={() => setOpenTerminateAndCallDialog(true)}
                        disabled={!callStatus?.isInitiated}
                        className={`font-medium py-2 px-4 md:px-8 text-sm md:text-base rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                          callStatus?.isInitiated
                            ? "bg-black hover:bg-black text-white"
                            : "bg-black cursor-not-allowed text-white opacity-70"
                        }`}
                      >
                        Terminate And Call Myself
                      </button>
                    </div>
                  </div>
                </div>

                {/* Always show in desktop, conditionally in mobile */}
                <div
                  className={`w-[32%] flex flex-col max-md:ml-0 max-md:w-full  ${
                    showTranscript ? "block" : "hidden md:block"
                  }`}
                >
                  {/* Note text updated with orange color */}
                  {/* <div className="mb-3 text-sm tracking-tight text-[#E5573F]">
                  <p>
                    Tip: Feel free to close this browser. Your booking
                    confirmation will be sent to you over email and text.
                  </p>
                </div> */}
                  {/* <ScrollArea className="h-full w-full md:w-auto">
                  <ChatSection
                    doctorName={doctors[activeCallIndex]?.name}
                    transcripts={getDisplayTranscript()}
                  />
                </ScrollArea> */}
                  <h2 className="hidden md:block">Live AI Call Transcript</h2>
                  <div className="h-[900px] overflow-y-auto pt-2 ">
                    <ChatSection
                      doctorName={doctors[activeCallIndex]?.name}
                      transcripts={getDisplayTranscript()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-lg h-52 px-4 ">
              <DialogHeader>
                <DialogTitle>Pause Calling</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                This will pause your appointment booking request and cannot be
                undone. Continue?
              </p>
              <div className="md:flex  flex  justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenDialog(false)}
                >
                  No
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2 rounded-md"
                  onClick={confirmTermination}
                >
                  Yes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openModifyDialog} onOpenChange={setOpenModifyDialog}>
            <DialogContent className="sm:max-w-lg h-52">
              <DialogHeader>
                <DialogTitle>Modify Request</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                This will terminate your current request and redirect you to
                modify your request. Continue?
              </p>
              <div className="md:flex flex justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenModifyDialog(false)}
                >
                  No
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2 rounded-md"
                  onClick={confirmModifyRequest}
                >
                  Yes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openTerminateAndCallDialog}
            onOpenChange={setOpenTerminateAndCallDialog}
          >
            <DialogContent className="sm:max-w-lg h-52">
              <DialogHeader>
                <DialogTitle>Terminate and Call Myself</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                This will terminate your current request and allow you to call
                the doctor directly. Continue?
              </p>
              <div className=" md:flex flex  justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenTerminateAndCallDialog(false)}
                >
                  No
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2 rounded-md"
                  onClick={confirmTerminateAndCallMyself}
                >
                  Yes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openPhoneNumberDialog}
            onOpenChange={setOpenPhoneNumberDialog}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Notice</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                Enter your phone number to get the appointment confirmation
              </p>
              <div className="flex justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenPhoneNumberDialog(false)}
                >
                  Later
                </Button>
                <Button
                  className="w-1/2 rounded-md bg-[#0074BA] hover:bg-blue-600"
                  onClick={() => {
                    setOpenPhoneNumberDialog(false);
                    setTimeout(() => {
                      setOpenQuickDetailsModal(true);
                    }, 1000);
                  }}
                >
                  OK
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Quick Details Modal for collecting phone number */}
          <QuickDetailsModal
            open={openQuickDetailsModal}
            onOpenChange={setOpenQuickDetailsModal}
            //initialSpecialty={specialty}
            updatePreferences={true}
            confirmUpdatePreferences={confirmUpdatePreferences}
            setispreferencesUpdated={setIsPreferencesUpdated}
            setIsPreferencesReinitialized={setIsPreferencesReinitialized}
          />
          <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
            <DialogContent className="sm:max-w-lg h-52">
              <DialogHeader>
                <DialogTitle>Remove Doctor</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                Are you sure you want to remove this doctor from the list?
              </p>
              <div className="md:flex flex justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenRemoveDialog(false)}
                >
                  No
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2 rounded-md"
                  onClick={confirmRemoveDoctor}
                >
                  Yes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openResumeDialog} onOpenChange={setOpenResumeDialog}>
            <DialogContent className="sm:max-w-lg h-52">
              <DialogHeader>
                <DialogTitle>Resume Calling</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                This will resume your appointment booking request and begin
                calling the next available doctor. Continue?
              </p>
              <div className="md:flex flex justify-between gap-6">
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-md"
                  onClick={() => setOpenResumeDialog(false)}
                >
                  No
                </Button>
                <Button
                  className="w-1/2 rounded-md bg-[#0074BA] hover:bg-blue-600"
                  onClick={confirmResumeCall}
                >
                  Yes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* <FooterSection /> */}
        </>
      )}
    </main>
  );
}
