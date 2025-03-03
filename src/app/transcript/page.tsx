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
import { useParams, useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Column from "../search/features/column";
import { toast } from "sonner";
import axios from "axios";
import { DoctorCard } from "./DoctorCard";
import { ChatSection } from "./ChatSection";

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
  const [context, setcontext] = useState("");
  useEffect(() => {
    const storedFormData = sessionStorage.getItem("formData");
    if (storedFormData) {
      console.log(JSON.parse(storedFormData));
      setFormData(JSON.parse(storedFormData));
    }
  }, []);

  useEffect(() => {
    activeCallIndexRef.current = activeCallIndex;
  }, [activeCallIndex]);

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log("doctors-numbers-up", numbers);
    setPhoneNumbers(numbers);
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("statusData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const sortedData = parsedData.results.slice(0, 10).map((item, index) => {
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
          address: item.vicinity || "Address unavailable",
          status: "queue", // Default status
          waitTime: "Excellent wait time", // Default wait time
          appointments: "New patient appointments", // Default appointment text
          phone_number: item.phone_number || null,
          place_id: item.place_id,
          vicinity: item.vicinity || "",
          website: item.website || "",
          isSponsored: false, // Default not sponsored
        };
      });
      console.log({ parsedData });
      console.log({ sortedData });
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

          console.log("fetchPhone", response);
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
  //console.log(phoneNumbers.length);
  useEffect(() => {
    if (callStatus.isInitiated && callStatus.ssid && wsRef.current) {
      setShowTranscript(true);
      setTranscriptArray((prev) => [
        ...prev,
        `Hello, I'm connecting you with ${doctors[activeCallIndex]?.name}...\n`,
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
        patient_number: phoneNumber,
        patient_name: patientName,
        hospital_name: nameOfOrg,
        patient_email: email,
        doctor_number: doctorPhoneNumber,
      };
      sessionStorage.setItem("context", context);
      console.log(data);
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

        toast.error(error?.response?.data?.detail, {
          duration: 20000,
        });
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
            // Save relevant information for success page
            const successMessage =
              call_ended_result?.confirmation_message ??
              "Appointment Booked Successfully";
            const doctorPhone = doctors[activeCallIndex]?.phone_number;

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
            toast.warning(
              "Appointment could not be booked. Trying next doctor..."
            );
            moveToNextDoctor();
          }
        }, 5000);
      }

      if (data.event === "call_in_process") {
        const timestamp = new Date().toLocaleTimeString();
        setTranscriptArray((prev) => [...prev, `${data.transcription}`]);
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
      // console.log(transcriptArray)
      return transcriptArray;
    }
    return "Waiting for conversation to begin...";
  };
  const handleEndCall = useCallback(
    async (id: string, retries = 2): Promise<any> => {
      const index = activeCallIndexRef.current;
      // console.log('cuurentIndex',index)
      const formData = JSON.parse(sessionStorage.getItem("formData"));
      const context = sessionStorage.getItem("context");
      const { email, phoneNumber, patientName, zipcode, request_id } = formData;
      const data = {
        call_id: id,
        request_id,
        doctor_number: doctors[index]?.phone_number, // phoneNumbers[index]
        hospital_name: doctors[index]?.name,
        doctor_address: doctors[index]?.vicinity,
        distance: doctors[index]?.distance,
        rating: doctors[index]?.rating,
        website: doctors[index]?.website,
        context,
        patient_name: patientName,
        patient_email: email,
        patient_number: phoneNumber,
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
    [doctors]
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
  return (
    <main className="flex flex-col bg-white h-screen overflow-hidden">
      <Navbar />
      <div className="mt-5 w-full border border-solid border-black border-opacity-10 min-h-px max-md:max-w-full 4 md:hidden mx-2 px-4" />
      <section className="flex flex-col items-start px-7 mt-8 w-full h-[calc(100vh-100px)] max-md:px-5 max-md:max-w-full">
        <div className="flex  gap-5  w-full text-lg font-medium tracking-tight max-w-[1272px] text-zinc-800 max-md:max-w-full mt-20">
          <h2 className="w-[82%]">Request Status</h2>
          <h2 className="  ">Chat Transcript</h2>
        </div>
        <div className="self-stretch mt-6 flex-1 overflow-hidden max-md:max-w-full">
          <div className="flex gap-5 h-full max-md:flex-col">
            {/* Left column with doctor cards and terminate button */}
            <div className="w-[68%] flex flex-col max-md:ml-0 max-md:w-full relative h-full">
              {/* Scrollable doctor cards container */}
              <div className="overflow-y-auto pr-2 h-[calc(100%-60px)]">
                {doctors.map((doctor, index) => (
                  <DoctorCard
                    key={index}
                    index={index}
                    activeCallIndex={activeCallIndex}
                    doctor={doctor}
                    callStatus={callStatus}
                    isAppointmentBooked={isAppointmentBooked}
                    onSkip={() => moveToNextDoctor(callStatus?.ssid)} // Move to next doctor
                  />
                ))}
              </div>

              {/* Terminate Request Button - fixed at bottom */}
              <div className="flex justify-center mt-4 pb-2">
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
              </div>
            </div>

            <div className="ml-5 w-[32%] flex flex-col max-md:ml-0 max-md:w-full">
              <ChatSection
                doctorName={doctors[activeCallIndex]?.name}
                transcripts={getDisplayTranscript()}
              />

              <footer className="mt-4 text-sm tracking-tight text-black self-end">
                <p>
                  <strong>Note:</strong> Feel free to close this browser. A
                  summary of the interaction(s) will be sent to you over email.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
