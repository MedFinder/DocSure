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
      const sortedData = parsedData.results.slice(0, 10).map((item, index) => ({
        ...item,
        id: item.place_id, // Keep unique ID
      }));
      setDoctors(sortedData);
    } else {
      router.push("/");
    }
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

  // const handleConfirmSequence = useCallback(async () => {
  //   if (!phoneNumbers[activeCallIndex] || !doctors[activeCallIndex]) {
  //     toast.error("No phone number or doctor information available.");
  //     return;
  //   }

  //   await connectWebSocket();
  //   try {
  //     setIsConfirmed(true);
  //     const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex];
  //     await initiateCall(
  //       firstDoctorPhoneNumber,
  //       doctors[activeCallIndex]?.name
  //     );
  //   } catch (error) {
  //     console.error("Error fetching phone numbers or initiating call:", error);
  //     setIsConfirmed(false);
  //   }
  // }, [activeCallIndex, phoneNumbers, doctors, connectWebSocket, initiateCall]);
  useEffect(() => {
    if (phoneNumbers.length > 0 && !callStatus.isInitiated) {
      console.log("✅ Phone numbers available, initiating call...");
      handleConfirmSequence();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumbers]); // 🌟 Runs ONLY when phoneNumbers updates

  //console.log(phoneNumbers.length);
  // const handleConfirmSequence = useCallback(async () => {
  //   if (!doctors.length) return; // Ensure doctors are loaded first

  //   console.log(phoneNumbers.length);
  //   if (!phoneNumbers.length) {
  //     console.log("📞 Waiting for phone numbers...");
  //     setTimeout(handleConfirmSequence, 1000);
  //     return;
  //   }

  //   console.log(
  //     "📞 Phone numbers available, proceeding with call:",
  //     phoneNumbers
  //   );

  //   await connectWebSocket();
  //   try {
  //     setIsConfirmed(true);
  //     const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex];
  //     console.log(
  //       "📞 Calling:",
  //       firstDoctorPhoneNumber,
  //       doctors[activeCallIndex]?.name
  //     );
  //     await initiateCall(
  //       firstDoctorPhoneNumber,
  //       doctors[activeCallIndex]?.name
  //     );
  //   } catch (error) {
  //     console.error("❌ Error initiating call:", error);
  //     setIsConfirmed(false);
  //   }
  // }, [phoneNumbers, doctors, activeCallIndex]);

  // const handleConfirmSequence = useCallback(async () => {
  //   if (!doctors.length) return;

  //   console.log("📞 Checking phoneNumbers.length:", phoneNumbers.length);

  //   if (!phoneNumbers.length) {
  //     console.log("📞 Waiting for phone numbers...");
  //     setTimeout(handleConfirmSequence, 1000);
  //     return;
  //   }

  //   console.log(
  //     "📞 Phone numbers available, proceeding with call:",
  //     phoneNumbers
  //   );

  //   await connectWebSocket();
  //   try {
  //     setIsConfirmed(true);
  //     const firstDoctorPhoneNumber = phoneNumbers[activeCallIndex];
  //     console.log(
  //       "📞 Calling:",
  //       firstDoctorPhoneNumber,
  //       doctors[activeCallIndex]?.name
  //     );

  //     await initiateCall(
  //       firstDoctorPhoneNumber,
  //       doctors[activeCallIndex]?.name
  //     );
  //   } catch (error) {
  //     console.error("❌ Error initiating call:", error);
  //     setIsConfirmed(false);
  //   }
  // }, [phoneNumbers, doctors, activeCallIndex]); // 🌟 Now re-runs when phoneNumbers updates

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
  // console.log(phoneNumbers, "numbers now");

  // console.log("new call initiated for", doctorPhoneNumber, nameOfOrg);

  //console.log(formData);
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
        // zipcode,
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
      // if (zipcode) context += `; Zipcode:${zipcode}`;

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
      const { email, phoneNumber, patientName, request_id } = formData;
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
    <>
      <Navbar />
      <div className=" mt-24  md:hidden mx-2 px-4 ">
        <div className="flex flex-wrap  w-full ml-2 border md:border-gray-600 rounded-none overflow-hidden shadow-sm outline-none  gap-2 md:gap-0 ">
          {/* Search Icon */}

          {/* First Input */}
          <Input
            type="text"
            placeholder="Condition, procedure, doctor"
            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
          />

          {/* Location Icon */}

          {/* Second Input */}
          <Input
            type="text"
            placeholder="Address, city, zip code"
            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
          />

          {/* Search Button */}
          <Link href="/search">
            <Button className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center w-full md:w-0">
              <Search className="text-white w-5 h-5 font-bold" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 w-full md:mt-24 gap-4 ">
        {/* First column (2/3 width) */}
        <div className="col-span-2 flex flex-col h-[calc(100vh-6rem)]">
          <p className="px-8 py-4 text-lg">Request Status</p>
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
          >
            <ScrollArea className="flex-1 min-h-0 overflow-auto">
              <Column
                activeCallIndex={activeCallIndex}
                tasks={doctors}
                isDraggable={!isConfirmed}
                callStatus={callStatus}
                isAppointmentBooked={isAppointmentBooked}
              />
              <ScrollBar />
            </ScrollArea>
          </DndContext>
        </div>

        {/* Second column (1/3 width) */}
        <div className=" col-span-1 p-4 px-7">
          <p className=" py-4 text-lg">Chat Transcript</p>

          <ScrollArea className="h-96 bg-red-400">
            {showTranscript && (
              <pre className=" whitespace-pre-wrap py-4 overflow-y-auto">
                {getDisplayTranscript()}
              </pre>
            )}
          </ScrollArea>
          <p className="text-sm py-4">
            Note: Feel free to close this browser. A summary of the
            interaction(s) will be sent to you over email.
          </p>
        </div>
      </div>
    </>
  );
}
