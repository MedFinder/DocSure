//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Column from "../../components/older-pages/search/features/column";
import { toast } from "sonner";
import axios from "axios";
import { DoctorCard } from "./DoctorCard";
import { ChatSection } from "./ChatSection";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { track } from "@vercel/analytics";

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
  // Add other doctors here...
];

export default function Transcript() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  // console.log(apiKey);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
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
  const [formData, setFormData] = useState();
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);
  const [activeCallIndex, setActiveCallIndex] = useState(0);
  const activeCallIndexRef = useRef(activeCallIndex);
  const requestIdRef = useRef(formData?.request_id);
  const callStatusRef = useRef(callStatus);
  const [context, setcontext] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false); // Dialog for Modify Request
  const [openTerminateAndCallDialog, setOpenTerminateAndCallDialog] =
    useState(false); // Dialog for Terminate and Call Myself
  const [isTerminated, setIsTerminated] = useState(false);

  useEffect(() => {
    const storedFormData = sessionStorage.getItem("formData");
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

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log("doctors-numbers-up", numbers);
    setPhoneNumbers(numbers);
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("statusData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const sortedData = parsedData.results.map((item, index) => {
        // Transform each Google Places API result into a Doctor type
        return {
          id: item.place_id, // Preserve the original id from place_id
          name: item.name || "Unknown Doctor",
          title: item.types?.includes("health")
            ? "Primary Care Doctor"
            : "Specialist",
          image: item.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${apiKey}`
            : "https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/32f8cd0111f56e136efcbd6101e6337252cafc553df7f9f44ddaf8ad44ca8914?placeholderIfAbsent=true",
          rating: item.rating || 0,
          reviews: item.user_ratings_total || 0,
          distance: item.distance || "Unknown distance",
          address: item.formatted_address || "Address unavailable",
          status: "queue", // Default status
          waitTime: "Excellent wait time", // Default wait time
          appointments: "New patient appointments", // Default appointment text
          phone_number: item.phone_number || null,
          place_id: item.place_id,
          vicinity: item.formatted_address || "",
          website: item.website || "",
          isSponsored: false, // Default not sponsored
        };
      });
      // console.log({ parsedData });
      // console.log({ sortedData });
      setDoctors(sortedData);
    } else {
      router.push("/");
    }
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
    if (phoneNumbers.length > 0 && !callStatus.isInitiated) {
      console.log("✅ Phone numbers available, initiating call...");
      handleConfirmSequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumbers]); // 🌟 Runs ONLY when phoneNumbers updates

  const handleConfirmSequence = useCallback(async () => {
    // initiate call
    try {
      setIsConfirmed(true); // Disable button and dragging
      const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex]; // '+2348168968260'
      await initiateCall(
        firstDoctorPhoneNumber,
        doctors[activeCallIndex]?.name,
        requestIdRef?.current
      );
      return;
    } catch (error) {
      console.error("Error initiating call:", error);
      setIsConfirmed(false); // Re-enable button and dragging if there's an error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCallIndex, doctors, phoneNumbers]);
  //console.log(phoneNumbers.length);
  useEffect(() => {
    if (callStatus.isInitiated && callStatus.ssid && wsRef.current) {
      setShowTranscript(true);
      setTranscriptArray((prev) => [
        ...prev,
        `Calling ${doctors[activeCallIndex]?.name} to seek an appointment\n`,
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
    // wsRef?.current?.close();
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
  const handleTerminateRequest = () => {
    setOpenDialog(true);
  };
  const confirmTermination = () => {
    track("Terminate_Request_Btn_Clicked");
    terminateRequest();
    setIsTerminated(true);
    setOpenDialog(false);
    toast.success("Your request has been terminated successfully.");
  };
  const initiateCall = useCallback(
    async (
      doctorPhoneNumber: string,
      nameOfOrg: string,
      request_id?: string
    ) => {
      console.log(
        "new call initiated for",
        doctorPhoneNumber,
        nameOfOrg,
        request_id
      );
      if (!formData) {
        console.error("No formData found in sessionStorage.");
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
        selectedOption,
        dob,
        address,
        selectedAvailability,
        timeOfAppointment,
        insuranceType,
        isnewPatient,
        gender,
        // zipcode,
        insurer,
        maxWait,
      } = formData;

      let context =
        "Clinical concerns:" +
        objective +
        "; " +
        "Patient has insurance:" +
        selectedOption;

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
        patient_number: phoneNumber,
        patient_name: patientName,
        hospital_name: nameOfOrg,
        patient_email: email,
        doctor_number: doctorPhoneNumber,
      };
      sessionStorage.setItem("context", context);
      // console.log(data);
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
        sessionStorage.setItem("formData", JSON.stringify(updatedFormData));
      } catch (error) {
        track("Initiated_new_call_failed");
        console.log(error, "error initiating bland AI");

        toast.error(error?.response?.data?.detail, {
          duration: 20000,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );
  const moveToNextDoctor = async (
    id: string,
    currentindex: number,
    request_id: string
  ) => {
    // console.log(id,currentindex,request_id)
    let newIndex = currentindex + 1;
    if (id) {
      // wsRef?.current?.close(); // temp solution; disconnect websocket and connect to a new one
      terminateCurrentCall(id);
    }
    // Move to the next doctor
    setActiveCallIndex(newIndex);
    // console.log(newIndex,'newIndex');
    if (newIndex < doctors.length) {
      const nextDoctor = doctors[newIndex];
      // console.log("Calling next doctor:", nextDoctor);

      const phoneNumber = phoneNumbers[newIndex] ?? nextDoctor?.phone_number; //+2348168968260
      const nameOfOrg = nextDoctor?.name; //+2348168968260
      if (phoneNumber) {
        await initiateCall(
          phoneNumber,
          nameOfOrg,
          request_id ?? requestIdRef?.current
        );
      } else {
        console.log("No phone number available for the next doctor.");
        toast.error("Next doctor has no phone number. Skipping...");
        // setActiveCallIndex((prevIndex) => prevIndex + 1); // Move to the next doctor
      }
    } else {
      wsRef?.current?.close();
      toast.success("All doctors have been called successfully..");
      setIsConfirmed(false);
      setCallStatus({
        isInitiated: false,
        ssid: "",
        email: "",
      });
    }
  };
  const connectWebSocket = (id?: string) => {
    // if (wsRef?.current) {
    //   //check if exisiting connection exists and disconnect
    //   console.log("disconnect exisiting connection if it exists...");
    //   wsRef?.current?.close();
    // }
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
      // console.log("WebSocket Message:", data);
      if (data.event === "call_ended") {
        // console.log("Call Ended Data:", data);
        setTimeout(async () => {
          const call_ended_result = await handleEndCall(data?.call_sid);
          console.log({ call_ended_result });
          if (call_ended_result?.status == "yes") {
            // Save relevant information for success page
            const successMessage =
              call_ended_result?.confirmation_message ??
              "Appointment Booked Successfully";
            sendSMS(successMessage);
            const doctorPhone =
              doctors[activeCallIndexRef.current]?.phone_number;
            // make the sms call to the patient
            setIsAppointmentBooked(true);
            wsRef?.current?.close();

            // Pass parameters to success page using router.push with query params
            router.push(
              `/success?success_message=${encodeURIComponent(
                successMessage
              )}&phone_number=${encodeURIComponent(doctorPhone || "")}`
            );
            return;
          } else {
            // console.log("call ended but not booked..this is where skip happens");
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

      if (data.event === "call_in_process") {
        const timestamp = new Date().toLocaleTimeString();
        if (callStatusRef.current.ssid === data?.call_sid) {
          setTranscriptArray((prev) => [...prev, `${data.transcription}`]);
        }
      }

      if (data.event === "call_not_picked") {
        // doctor did not pick call...move to next
        if (callStatusRef.current.ssid === data?.call_sid) {
          toast.info("Doctor did not pick call. Trying next doctor...");
          moveToNextDoctor(
            null,
            activeCallIndexRef.current,
            formData.request_id
          );
        }
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

  // const logDrLists = async () => {
  //   // Create arrays to collect the values
  //   const doctor_numbers = [];
  //   const hospital_names = [];
  //   const addresses = [];
  //   const distances = [];
  //   const ratings = [];
  //   const websites = [];

  //   // Map through the doctors and phoneNumbers arrays
  //   for (let i = 0; i < doctors.length; i++) {
  //     // Add values to respective arrays, ensuring we handle potentially missing values
  //     doctor_numbers.push(phoneNumbers[i] || 'N/A');
  //     hospital_names.push(doctors[i]?.name || 'N/A');
  //     addresses.push(doctors[i]?.vicinity || 'N/A');
  //     distances.push(doctors[i]?.distance || 'N/A');
  //     ratings.push(doctors[i]?.rating || 0);
  //     websites.push(doctors[i]?.website || 'N/A');
  //   }
  //   const formData = JSON.parse(sessionStorage.getItem("formData"));
  //   // console.log(formData);
  //   const { request_id } = formData;
  //   // Create final object with comma-separated values
  //   const result = {
  //     request_id,
  //     doctor_numbers: doctor_numbers.join(','),
  //     hospital_names: hospital_names.join(','),
  //     addresses: addresses.join(','),
  //     distances: distances.join(','),
  //     ratings: ratings.join(','),
  //     websites: websites.join(',')
  //   };

  //   console.log(result, 'log dr lists');

  //   try {
  //     const resp = await axios.post(
  //       `https://callai-backend-243277014955.us-central1.run.app/api/log-doctor-list`,
  //       result
  //     );
  //     // console.log(resp?.data)
  //     return;
  //   } catch (error) {
  //     console.log('Error logging dr details:', error);
  //     return null;
  //   }
  // };
  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      // console.log(transcriptArray)
      return transcriptArray;
    }
    return "Waiting for conversation to begin...";
  };
  const handleEndCall = useCallback(
    async (id: string, retries = 2): Promise<any> => {
      const index = activeCallIndexRef.current;
      // console.log('cuurentIndex',index)
      // const formData = JSON.parse(sessionStorage.getItem("formData"));
      const context = sessionStorage.getItem("context");
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
        doctor_address: doctors[index]?.vicinity,
        hospital_address: doctors[index]?.vicinity,
        distance: doctors[index]?.distance,
        rating: doctors[index]?.rating?.toString(),
        hospital_rating: doctors[index]?.rating?.toString(),
        website: doctors[index]?.website,
        context,
        patient_name: patientName,
        patient_email: email,
        patient_number: phoneNumber,
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

      const savedAddress = sessionStorage.getItem("selectedAddress");
      const specialty = formData?.specialty;

      router.push("/appointment");
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

  // const handleCall = () => {
  //   window.location.href = `tel:${+2348167238042}`;
  // };

  return (
    <main className="flex flex-col bg-white h-screen overflow-hidden">
      <Navbar />

      <div className="mt-5 w-full border border-solid border-black border-opacity-10 min-h-px max-md:max-w-full md:hidden mx-2 px-4" />
      <section className="flex flex-col items-start px-7 mt-8 w-full h-[calc(100vh-100px)] max-md:px-5 max-md:max-w-full ">
        <div className=" flex  w-full  text-[#333333] md:text-lg mt-20 ">
          <h2 className=" w-2/3 mt-6 md:mt-0">Request Status</h2>
          <h2 className="w-1/3 pl-8 hidden md:block">Chat Transcript</h2>
          <button
            onClick={toggleTranscript}
            className="w-1/3 mt-6 md:mt-0 text-sm text whitespace-nowrap md:hidden text-[#FF6723] underline"
          >
            {showTranscript ? "Back to List" : "View Transcript"}
          </button>
        </div>

        <div className="self-stretch mt-6 flex-1 overflow-hidden max-md:max-w-full">
          <div className="flex gap-5 h-full max-md:flex-col">
            <div
              className={`w-[68%] flex flex-col max-md:ml-0 max-md:w-full relative h-full ${
                showTranscript ? "hidden md:block" : "block"
              }`}
            >
              {/* Scrollable doctor cards container */}

              <div className="pr-2 h-[calc(100%-60px)]">
                <ScrollArea className="h-full w-full md:w-auto">
                  {doctors.map((doctor, index) => (
                    <DoctorCard
                      key={index}
                      index={index}
                      activeCallIndex={activeCallIndex}
                      doctor={doctor}
                      callStatus={callStatus}
                      isAppointmentBooked={isAppointmentBooked}
                      onSkip={() => {
                        track("Skip_Call_Btn_Clicked");
                        moveToNextDoctor(
                          callStatus?.ssid,
                          activeCallIndexRef.current,
                          formData.request_id
                        );
                      }} // Move to next doctor
                    />
                  ))}
                </ScrollArea>
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
              <div className="flex flex-row md:flex-row gap-4 justify-start md:justify-center mt-4 pb-2 overflow-x-auto whitespace-nowrap ">
                <button
                  onClick={handleTerminateRequest}
                  disabled={!callStatus?.isInitiated}
                  className={`font-medium py-2 px-4 md:px-8 text-sm md:text-base rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                    callStatus?.isInitiated
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-300 cursor-not-allowed text-white opacity-70"
                  }`}
                >
                  Terminate Request
                </button>
                <button
                  onClick={() => setOpenModifyDialog(true)}
                  disabled={!callStatus?.isInitiated}
                  className={`font-medium py-2 px-4 md:px-8 text-sm md:text-base rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    callStatus?.isInitiated
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-300 cursor-not-allowed text-white opacity-70"
                  }`}
                >
                  Modify My Request
                </button>
                <button
                  onClick={() => setOpenTerminateAndCallDialog(true)}
                  disabled={!callStatus?.isInitiated}
                  className={`font-medium py-2 px-4 md:px-8 text-sm md:text-base rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                    callStatus?.isInitiated
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-orange-300 cursor-not-allowed text-white opacity-70"
                  }`}
                >
                  Terminate And Call Myself
                </button>
              </div>
            </div>

            {/* Always show in desktop, conditionally in mobile */}
            <div
              className={`ml-5 w-[32%] flex flex-col max-md:ml-0 max-md:w-full ${
                showTranscript ? "block" : "hidden md:block"
              }`}
            >
              {/* Note text updated with orange color */}
              {/* <div className="mb-3 text-sm tracking-tight text-[#FF6723]">
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
              <div className="h-[900px] overflow-y-auto ">
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
            <DialogTitle>Terminate Request</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            This will terminate your appointment booking request and cannot be
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
            This will terminate your current request and redirect you to modify
            your request. Continue?
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
            This will terminate your current request and allow you to call the
            doctor directly. Continue?
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
    </main>
  );
}
