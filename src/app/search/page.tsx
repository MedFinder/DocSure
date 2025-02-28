//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Column from "./features/column";
import SortableDoctor from "./features/column";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";

const timingOptions = [
  { value: "today", label: "Today" },
  { value: "few days", label: "Few days" },
  { value: "two weeks", label: "Two weeks" },
  { value: "2+ weeks", label: "2+ weeks" },
];

const availabilityOptions = [
  { value: "av-anytime", label: "I am available anytime" },
];
const insurerOptions = [
  { value: "Aetna", label: "Aetna" },
  { value: "Aflac", label: "Aflac" },
  { value: "Alignment Healthcare", label: "Alignment Healthcare" },
  {
    value: "Allstate Insurance Company",
    label: "Allstate Insurance Company",
  },
  { value: "AlohaCare", label: "AlohaCare" },
  {
    value: "AMA Insurance Agency, Inc.",
    label: "AMA Insurance Agency, Inc.",
  },
  {
    value: "American Fidelity Assurance Company",
    label: "American Fidelity Assurance Company",
  },
  { value: "American Specialty Health", label: "American Specialty Health" },
  { value: "AmeriHealth", label: "AmeriHealth" },
  {
    value: "AmeriHealth Administrators",
    label: "AmeriHealth Administrators",
  },
  {
    value: "AmeriHealth Caritas Family of Companies",
    label: "AmeriHealth Caritas Family of Companies",
  },
  {
    value: "Arkansas BlueCross Blue Shield",
    label: "Arkansas BlueCross Blue Shield",
  },
  { value: "AultCare Corporation", label: "AultCare Corporation" },
  { value: "Avera Health Plans", label: "Avera Health Plans" },
  { value: "AvMed Health Plan", label: "AvMed Health Plan" },
  {
    value: "Bankers Life and Casualty Company",
    label: "Bankers Life and Casualty Company",
  },
  { value: "Birdsong Hearing Benefits", label: "Birdsong Hearing Benefits" },
  {
    value: "Blue Cross and Blue Shield of Georgia",
    label: "Blue Cross and Blue Shield of Georgia",
  },
  {
    value: "Blue Cross and Blue Shield of Illinois",
    label: "Blue Cross and Blue Shield of Illinois",
  },
  {
    value: "Blue Cross and Blue Shield of Montana",
    label: "Blue Cross and Blue Shield of Montana",
  },
  {
    value: "Blue Cross and Blue Shield of New Mexico",
    label: "Blue Cross and Blue Shield of New Mexico",
  },
  {
    value: "Blue Cross Blue Shield of Michigan",
    label: "Blue Cross Blue Shield of Michigan",
  },
  {
    value: "Blue Cross Blue Shield of North Carolina",
    label: "Blue Cross Blue Shield of North Carolina",
  },
  { value: "Blue Cross of Idaho", label: "Blue Cross of Idaho" },
  { value: "Blue Shield of California", label: "Blue Shield of California" },
  {
    value: "BlueCross BlueShield of Oklahoma",
    label: "BlueCross BlueShield of Oklahoma",
  },
  {
    value: "BlueCross BlueShield of Tennessee",
    label: "BlueCross BlueShield of Tennessee",
  },
  {
    value: "BlueCross BlueShield of Texas",
    label: "BlueCross BlueShield of Texas",
  },
  { value: "Cambia Health Solutions", label: "Cambia Health Solutions" },
  {
    value: "Capital District Physicians´ Health Plan",
    label: "Capital District Physicians´ Health Plan",
  },
  { value: "CareFirst", label: "CareFirst" },
  { value: "CareOregon", label: "CareOregon" },
  { value: "CareSource", label: "CareSource" },
  { value: "Celtic Insurance Company", label: "Celtic Insurance Company" },
  { value: "CENTENE Corp.", label: "CENTENE Corp." },
  { value: "Clever Care Health Plan", label: "Clever Care Health Plan" },
  { value: "CNO Financial Group", label: "CNO Financial Group" },
  {
    value: "Commonwealth Care Alliance",
    label: "Commonwealth Care Alliance",
  },
  {
    value: "Community Health Network of Connecticut",
    label: "Community Health Network of Connecticut",
  },
  { value: "Curative Inc", label: "Curative Inc" },
  { value: "CVS Health", label: "CVS Health" },
  { value: "Davies Life & Health", label: "Davies Life & Health" },
  { value: "Dean Health Plan, Inc.", label: "Dean Health Plan, Inc." },
  {
    value: "Delta Dental Plans Association",
    label: "Delta Dental Plans Association",
  },
  { value: "Elevance Health", label: "Elevance Health" },
  { value: "FedPoint", label: "FedPoint" },
  { value: "Fidelity", label: "Fidelity" },
  { value: "Florida Blue", label: "Florida Blue" },
  { value: "Gen Re", label: "Gen Re" },
  {
    value: "Guarantee Trust Life Insurance Company",
    label: "Guarantee Trust Life Insurance Company",
  },
  { value: "GuideWell", label: "GuideWell" },
  {
    value: "Harvard Pilgrim Health Care",
    label: "Harvard Pilgrim Health Care",
  },
  {
    value: "Health Alliance Medical Plan",
    label: "Health Alliance Medical Plan",
  },
  {
    value: "Health Care Service Corporation",
    label: "Health Care Service Corporation",
  },
  {
    value: "Health Net of California, Inc.",
    label: "Health Net of California, Inc.",
  },
  {
    value: "Health Net Community Solutions",
    label: "Health Net Community Solutions",
  },
  {
    value: "Health Plan of San Joaquin",
    label: "Health Plan of San Joaquin",
  },
  { value: "HealthEquity", label: "HealthEquity" },
  { value: "Healthfirst, Inc.", label: "Healthfirst, Inc." },
  { value: "HealthPartners", label: "HealthPartners" },
  { value: "Highmark Health", label: "Highmark Health" },
  { value: "Hometown Health Plan", label: "Hometown Health Plan" },
  {
    value: "Horizon BC/BS of New Jersey",
    label: "Horizon BC/BS of New Jersey",
  },
  { value: "Humana Inc.", label: "Humana Inc." },
  { value: "Independence Blue Cross", label: "Independence Blue Cross" },
  { value: "Independent Health", label: "Independent Health" },
  {
    value: "Insurance Administrative Solutions, L.L.C.",
    label: "Insurance Administrative Solutions, L.L.C.",
  },
  {
    value: "John Hancock Financial Services",
    label: "John Hancock Financial Services",
  },
  {
    value: "Johns Hopkins Health Plans",
    label: "Johns Hopkins Health Plans",
  },
  { value: "Kaiser Permanente", label: "Kaiser Permanente" },
  { value: "L.A. Care", label: "L.A. Care" },
  { value: "Liberty Dental Plan", label: "Liberty Dental Plan" },
  {
    value: "LifeSecure Insurance Company",
    label: "LifeSecure Insurance Company",
  },
  {
    value: "Local Initiative Health Authority",
    label: "Local Initiative Health Authority",
  },
  { value: "Magellan Health", label: "Magellan Health" },
  {
    value: "Martin’s Point Health Care",
    label: "Martin’s Point Health Care",
  },
  {
    value: "Mass General Brigham Health Plan",
    label: "Mass General Brigham Health Plan",
  },
  { value: "Medica Health Plan", label: "Medica Health Plan" },
  { value: "Medical Card System (MCS)", label: "Medical Card System (MCS)" },
  { value: "Medical Mutual of Ohio", label: "Medical Mutual of Ohio" },
  { value: "Meridian Health Plan", label: "Meridian Health Plan" },
  { value: "MetroPlusHealth", label: "MetroPlusHealth" },
  { value: "Metropolitan", label: "Metropolitan" },
  { value: "Moda Health", label: "Moda Health" },
  { value: "Molina Healthcare", label: "Molina Healthcare" },
  { value: "MVP Health Care", label: "MVP Health Care" },
  {
    value: "National General Accident & Health",
    label: "National General Accident & Health",
  },
  { value: "National Guardian Life", label: "National Guardian Life" },
  {
    value: "Neighborhood Health Plan of Rhode Island",
    label: "Neighborhood Health Plan of Rhode Island",
  },
  {
    value: "New York Life Insurance Company",
    label: "New York Life Insurance Company",
  },
  {
    value: "PacificSource Health Plans",
    label: "PacificSource Health Plans",
  },
  { value: "Paramount Health Care", label: "Paramount Health Care" },
  {
    value: "Physicians Mutual Insurance Company",
    label: "Physicians Mutual Insurance Company",
  },
  { value: "Point32Health", label: "Point32Health" },
  { value: "Providence Health Plans", label: "Providence Health Plans" },
  { value: "Quartz Health Solutions", label: "Quartz Health Solutions" },
  { value: "Regence BC/BS of Oregon", label: "Regence BC/BS of Oregon" },
  { value: "Regence Blue Shield", label: "Regence Blue Shield" },
  {
    value: "Regence BlueCross BlueShield of Utah",
    label: "Regence BlueCross BlueShield of Utah",
  },
  {
    value: "Regence BlueShield of Idaho",
    label: "Regence BlueShield of Idaho",
  },
  { value: "Sanford Health Plans", label: "Sanford Health Plans" },
  { value: "SCAN Health Plan", label: "SCAN Health Plan" },
  { value: "Sentara Healthcare", label: "Sentara Healthcare" },
  { value: "Sharp Health Plan", label: "Sharp Health Plan" },
  { value: "St. Luke’s Health Plan", label: "St. Luke’s Health Plan" },
  {
    value: "State Farm Insurance Companies",
    label: "State Farm Insurance Companies",
  },
  { value: "SummaCare", label: "SummaCare" },
  { value: "Sutter Health Plan", label: "Sutter Health Plan" },
  { value: "Swiss Re America", label: "Swiss Re America" },
  { value: "The Cigna Group", label: "The Cigna Group" },
  {
    value: "Thrivent Financial for Lutherans",
    label: "Thrivent Financial for Lutherans",
  },
  {
    value: "Trustmark Insurance Company",
    label: "Trustmark Insurance Company",
  },
  { value: "Tufts Health Plan", label: "Tufts Health Plan" },
  { value: "UCare", label: "UCare" },
  {
    value: "UNICARE Life & Health Insurance Company",
    label: "UNICARE Life & Health Insurance Company",
  },
  { value: "UnitedHealthcare", label: "UnitedHealthcare" },
  {
    value: "University Health Alliance",
    label: "University Health Alliance",
  },
  {
    value: "UPMC Health Insurance Plans",
    label: "UPMC Health Insurance Plans",
  },
  { value: "USAA", label: "USAA" },
  { value: "VIVA Health, Inc.", label: "VIVA Health, Inc." },
  { value: "Wellabe", label: "Wellabe" },
  { value: "Wellfleet", label: "Wellfleet" },
  { value: "Western Health Advantage", label: "Western Health Advantage" },
  { value: "Zurich North America", label: "Zurich North America" },
];

export default function SearchPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState("no");
  const [customAvailability, setCustomAvailability] = useState("");
  const [timeOfAppointment, settimeOfAppointment] = useState("today");
  const [searchData, setSearchData] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedOption, setSelectedOption] = useState("no");

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

  // useEffect(() => {
  //   const storedData = sessionStorage.getItem("statusData");
  //   const storedDataNav = sessionStorage.getItem("statusDataNav");

  //   if (storedData || storedDataNav) {
  //     const parsedData = JSON.parse(storedData || storedDataNav);
  //     const sortedData = parsedData.results.slice(0, 10).map((item, index) => ({
  //       ...item,
  //       id: item.place_id, // Keep unique ID
  //     }));

  //     // if (typeof window !== "undefined") {
  //     //   const storedSearchData = sessionStorage.getItem("searchData");
  //     //   if (storedSearchData) {
  //     //     const parsedDataB = JSON.parse(storedSearchData);
  //     //     setSearchData(parsedData);
  //     //     console.log("Retrieved Data:", parsedDataB); // Logs when the component mounts
  //     //   }
  //     // }
  //     setDoctors(sortedData);
  //   } else {
  //     router.push("/");
  //   }
  // }, [router]);
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
          const sortedData = parsedData.results.slice(0, 10).map((item) => ({
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
            `https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,opening_hours,reviews,geometry&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&place_id=${doctor.place_id}`
          );
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
    setPhoneNumbers(numbers);
    // console.log(doctors,numbers,'xxxx')
  };
  useEffect(() => {
    if (doctors.length) {
      // console.log(doctors)
      getPhoneNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors]);

  const handleConfirmSequence = useCallback(async () => {
    await connectWebSocket();
    try {
      setIsConfirmed(true); // Disable button and dragging
      const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex]; // '+2348168968260'
      await initiateCall(
        firstDoctorPhoneNumber,
        doctors[activeCallIndex]?.name
      );
      return;
    } catch (error) {
      console.error("Error fetching phone numbers or initiating call:", error);
      setIsConfirmed(false); // Re-enable button and dragging if there's an error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCallIndex, phoneNumbers, doctors]);

  useEffect(() => {
    if (callStatus.isInitiated && callStatus.ssid && wsRef.current) {
      setShowTranscript(true);
      setTranscriptArray((prev) => [
        ...prev,
        `---CALL BEGINS FOR ${doctors[activeCallIndex]?.name}---\n`,
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
  }, [callStatus, doctors, wsRef]);

  const terminateRequest = () => {
    // sent ws event to cancel call
    wsRef?.current?.close();
    setIsConfirmed(false);
    terminateCurrentCall(callStatus?.ssid);
    setTimeout(() => {
      setCallStatus({
        isInitiated: false,
        ssid: "",
        email: "",
      });
    }, 500);
  };
  const initiateCall = useCallback(
    async (doctorPhoneNumber: string, nameOfOrg: string) => {
      console.log("new call initiated for", doctorPhoneNumber, nameOfOrg);
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      if (!formData) {
        console.error("No formData found in sessionStorage.");
        return;
      }

      const {
        email,
        phoneNumber,
        patientName,
        objective,
        subscriberId,
        groupId,
        selectedOption,
        dob,
        address,
        selectedAvailability,
        timeOfAppointment,
        isnewPatient,
        zipcode,
        insurer,
      } = formData;

      let context =
        "Clinical concerns:" +
        objective +
        "; " +
        "Patient has insurance:" +
        selectedOption;

      if (insurer) context += `; Insurance Provider:${insurer}`;
      if (subscriberId) context += `; Subscriber Id:${subscriberId}`;
      if (groupId) context += `; Group Id:${groupId}`;
      if (dob) context += `; Date of birth:${dob}`;
      if (address) context += `; Address of the patient:${address}`;
      if (selectedAvailability)
        context += `; Availability of the patient:${selectedAvailability}`;
      if (timeOfAppointment)
        context += `; Time Of Appointment:${timeOfAppointment}`;
      if (isnewPatient) context += `; Is New Patient:${isnewPatient}`;
      if (zipcode) context += `; Zipcode:${zipcode}`;

      const data = {
        objective: "Schedule an appointment",
        context: context,
        caller_number: phoneNumber,
        caller_name: patientName,
        name_of_org: nameOfOrg,
        caller_email: email,
        phone_number: doctorPhoneNumber,
      };
      sessionStorage.setItem("context", context);
      // console.log(data);
      try {
        const callResponse = await axios.post(
          "https://callai-backend-243277014955.us-central1.run.app/api/assistant-initiate-call",
          data
        );
        setCallStatus({
          isInitiated: true,
          ssid: callResponse.data.call_id,
          email: email,
        });
      } catch (error) {
        console.log(error, "error initiating bland AI");
        toast.error(error?.response?.data?.detail);
      }
    },
    []
  );

  const moveToNextDoctor = async (id: string) => {
    let newIndex = 0;
    if (id) {
      terminateCurrentCall(id);
    }
    // Move to the next doctor
    setActiveCallIndex((prevIndex) => {
      newIndex = prevIndex + 1;
      return newIndex;
    });
    // console.log(newIndex,activeCallIndex)
    if (newIndex + 1 <= doctors.length) {
      const nextDoctor = doctors[newIndex];
      //console.log("Calling next doctor:", nextDoctor);

      const phoneNumber = phoneNumbers[newIndex]; //+2348168968260
      const nameOfOrg = nextDoctor?.name; //+2348168968260
      if (phoneNumber) {
        await initiateCall(phoneNumber, nameOfOrg);
      } else {
        console.log("No phone number available for the next doctor.");
        toast.error("Next doctor has no phone number. Skipping...");
        // setActiveCallIndex((prevIndex) => prevIndex + 1); // Move to the next doctor
      }
    } else {
      toast.success("All doctors have been called successfully..");
      setIsConfirmed(false);
    }
  };
  const connectWebSocket = () => {
    if (wsRef?.current) {
      //check if exisiting connection exists and disconnect
      console.log("disconnect exisiting connection if it exists...");
      wsRef?.current?.close();
    }
    wsRef.current = new WebSocket(
      "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
    );

    wsRef.current.onopen = () => {
      console.log("WebSocket connected successfully and opened.");
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      // console.log("WebSocket Message:", data);

      if (data.event === "call_ended") {
        // console.log("Call Ended Data:", data);
        setTimeout(async () => {
          const call_ended_result = await handleEndCall(data?.call_sid);
          console.log({ call_ended_result });
          if (call_ended_result?.status == "yes") {
            // toast.success("Appointment Booked Successfully");
            Swal.fire({
              icon: "success",
              title: "Appointment Booked",
              text:
                call_ended_result?.confirmation_message ??
                "Appointment Booked Successfully",
              confirmButtonText: "Okay",
              //confirmButtonColor:""
            });
            setIsAppointmentBooked(true);
            wsRef?.current?.close();
            return;
          } else {
            toast.warning(
              "Appointment could not be booked. Trying next doctor..."
            );
            moveToNextDoctor();
          }
        }, 5000);
      }

      if (data.event === "call_in_process") {
        const timestamp = new Date().toLocaleTimeString();
        setTranscriptArray((prev) => [
          ...prev,
          `[${timestamp}] ${data.transcription}`,
        ]);
      }

      if (data.event === "call_not_picked") {
        // doctor did not pick call...move to next
        toast.info("Doctor did not pick call. Trying next doctor...");

        moveToNextDoctor();
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

  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      return transcriptArray.map((transcript) => `${transcript}\n`).join("");
    }
    return "Waiting for conversation to begin...";
  };
  const handleEndCall = useCallback(
    async (id: string, retries = 5): Promise<any> => {
      const index = activeCallIndexRef.current;
      // console.log('cuurentIndex',index)
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      const context = sessionStorage.getItem("context");
      const { email, phoneNumber, patientName, zipcode } = formData;
      const data = {
        call_id: id,
        doctor_phone_number: phoneNumbers[index],
        doctor_address: doctors[index]?.vicinity,
        patient_org_name: doctors[index]?.name,
        doctor_hospital_name: doctors[index]?.name,
        doctor_phone_number: doctors[index]?.phone_number,
        distance: doctors[index]?.distance,
        ratings: doctors[index]?.rating,
        website: doctors[index]?.website,
        patient_number: phoneNumber,
        patient_name: patientName,
        patient_email: email,
        calee_zip_code: zipcode,
        context,
      };
      // console.log(data)

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
    [doctors, phoneNumbers]
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
      console.error("Error ending call:", error);
      return true;
    }
  };

  useEffect(() => {
    if (selectedInsurance === "no") {
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("groupId", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsurance]);
  const formik = useFormik({
    initialValues: {
      specialty: "",
      location: "",
      objective: "",
      maxWait: "",
      availability: "",
      insurer: "",
      memberID: "",
      groupNumber: "",
      noInsurance: false,
    },
    validationSchema: Yup.object({
      // specialty: Yup.string().required("Required"),
      // location: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      router.push("/contact");
      // console.log("you got here");
      const updatedValues = {
        ...values,
        selectedAvailability,
        timeOfAppointment,
        isNewPatient,
        selectedOption,
        selectedInsurance,
      };
      console.log("you got her");
      console.log("updatedValues", updatedValues);
      console.log("Submitting form..."); // ✅ Debugging
      console.log("Values:", values);
      console.log("Extra Data:", {
        selectedAvailability,
        timeOfAppointment,
        isNewPatient,
        selectedOption,
        selectedInsurance,
      });

      setisLoading(false);
      if (!selectedLocation) {
        toast.error("No location selected");
        return;
      }

      try {
        const { lat, lng } = selectedLocation || { lat: 0, lng: 0 };
        const response = await axios.get(
          `https://callai-backend-243277014955.us-central1.run.app/api/search_places?location=${lat},${lng}&radius=20000&keyword=${formik.values.specialty}`
        );

        sessionStorage.setItem("formData", JSON.stringify(updatedValues));
        sessionStorage.setItem("statusData", JSON.stringify(response.data));

        // console.log("Form Data:", values);
        // console.log("API Response Data:", response.data);
        // Navigate to status page
        router.push("/contact");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  return (
    <>
      <Navbar />

      <form onSubmit={formik.handleSubmit}>
        {/* <div className="mt-24 md:hidden mx-2 px-4">
          <div className="flex flex-wrap w-full ml-2 border md:border-gray-600 rounded-none overflow-hidden shadow-sm outline-none gap-2 md:gap-0">
            <Input
              type="text"
              name="specialty"
              placeholder="Condition, procedure, doctor"
              className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
              value={formik.values.specialty}
              onChange={formik.handleChange}
            />
            <Input
              type="text"
              name="location"
              placeholder="Address, city, zip code"
              className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
              value={formik.values.location}
              onChange={formik.handleChange}
            />
            <Button
              type="submit"
              className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center w-full md:w-0"
            >
              Search
            </Button>
          </div>
        </div> */}

        {/* Filters Section */}
        <div className="md:flex justify-between mt-24 px-8 text-[#595959] py-4 border-b-2 text-sm">
          <div className="flex md:gap-4 md:flex-row flex-col gap-5">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-patient"
                checked={isNewPatient} // Use checked instead of value
                onCheckedChange={(value) => setIsNewPatient(value)}
                className="rounded-none"
              />
              <Label htmlFor="new-patient" className="font-medium">
                New Patient
              </Label>
            </div>

            {/* Health Concerns */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Health concerns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 py-6 px-4 space-y-2">
                <Textarea
                  placeholder="Your main medical concerns.."
                  name="objective"
                  value={formik.values.objective}
                  onChange={formik.handleChange}
                />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Max Wait */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Max wait
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="md:w-36 py-6 px-4 space-y-2">
                <RadioGroup
                  name="maxWait"
                  value={timeOfAppointment}
                  onValueChange={(value) => settimeOfAppointment(value)}
                  className="flex flex-col gap-4"
                >
                  {timingOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem id={option.value} value={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability */}
            <Select name="availability">
              <SelectTrigger className="md:w-[180px] w-full rounded-full">
                <SelectValue placeholder="Your availability" />
              </SelectTrigger>
              <SelectContent>
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  className="flex flex-col gap-4"
                >
                  {availabilityOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <RadioGroupItem id={option.value} value={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="custom" value="custom" />
                      <Label htmlFor="custom">Input your availability</Label>
                    </div>
                    {selectedOption === "custom" && (
                      <Textarea
                        placeholder="I’m free after 3 PM on weekdays"
                        value={customAvailability}
                        onChange={(e) => setCustomAvailability(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    )}
                  </div>
                </RadioGroup>
              </SelectContent>
            </Select>

            {/* Insurance */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Insurance
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 py-6 px-4 space-y-2">
                <div className="space-y-2">
                  <Label>Member ID</Label>
                  <Input
                    name="subscriberId"
                    value={formik.values.subscriberId}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Group Number</Label>
                  <Input
                    name="groupId"
                    value={formik.values.groupId}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Insurer (optional)</Label>
                  <Select
                    name="insurer"
                    // value={formik.values.insurer}
                    // onValueChange={formik.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurer" />
                    </SelectTrigger>
                    <SelectContent>
                      {insurerOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="noInsurance"
                    checked={selectedInsurance} // Use checked instead of value
                    onCheckedChange={(value) => setSelectedInsurance(value)}
                  />
                  <Label htmlFor="noInsurance">Don’t have insurance</Label>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-[#FFF6F2] p-4 px-7">
          <div className="flex items-center justify-between sm:gap-2">
            <p className="text-xs md:text-base">
              AI assistant will call the following recommended doctors in this
              sequence and seek an appointment for you.
            </p>
            <Button
              type="submit"
              // disabled={isLoading}
              className="bg-[#FF6723] text-white md:p-5 p-4"
            >
              Continue
            </Button>
          </div>
        </div>
      </form>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <ScrollArea className="h-[39rem] md:w-full w-auto whitespace-nowrap">
          <Column
            activeCallIndex={activeCallIndex}
            tasks={doctors}
            isDraggable={!isConfirmed}
            callStatus={callStatus}
            isAppointmentBooked={isAppointmentBooked}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>
      {/* <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <ScrollArea className="h-96 w-full">
          <Column
            activeCallIndex={activeCallIndex}
            tasks={doctors}
            isDraggable={!isConfirmed}
            callStatus={callStatus}
            isAppointmentBooked={isAppointmentBooked}
          />
        </ScrollArea>
        <div className="flex justify-between">
          <Button
            className="px-4 py-6 bg-[#EB6F27] "
            onClick={handleConfirmSequence}
            disabled={isConfirmed}
          >
            Confirm the doctor sequence
          </Button>
          <p className="px-2 py-2 text-sm text-gray-600">
            NB: You can move cards to adjust sequence
          </p>
        </div>
        <div>
          <p className="px-2 py-2 text-sm text-600">
            By continuing, you authorize us to book an appointment on your
            behalf.
          </p>
        </div>
      </DndContext> */}
    </>
  );
}
