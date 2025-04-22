//@ts-nocheck
import React, { useContext, useState } from "react";
import { Doctor } from "./types";
import { LocationInfo } from "./LocationInfo";
import { StatusBadge } from "./StatusBadge";
import { CallStatusType } from "../../components/older-pages/search/features/column";
import axios from "axios";
import dynamic from "next/dynamic";
import LoadingSummary from "../../components/Loading/LoadingSummary";
import { createContext } from "react";

const LoadingSumamry = dynamic(
  () => import("../../components/Loading/LoadingSummary"),
  {
    ssr: false, // Disable SSR for this component
  }
);
// Create a context to manage expanded rows
const ExpandContext = createContext({
  expandedId: null,
  setExpandedId: () => {},
});

// Provider component to wrap the task list
export const ExpandProvider = ({ children }) => {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <ExpandContext.Provider value={{ expandedId, setExpandedId }}>
      {children}
    </ExpandContext.Provider>
  );
};
// Hook to use the expand context
const useExpand = () => useContext(ExpandContext);
// Hook to use the expand context

interface DoctorCardProps {
  doctor: Doctor;
  onSkip?: () => void;
  onCallNext?: (index: number) => void; // Added callback for "Call next" functionality
  index: number;
  id: string;
  transcriptSummary: { place_id: ""; summary: "" };
  transcriptLoading: boolean;
  activeCallIndex: number;
  isAppointmentBooked: boolean;
  callStatus: CallStatusType;
  setTranscriptSummary: ({ place_id: string, summary: string }) => void;
  setTranscriptLoading: (loading: boolean) => void;
  reconnectWebSocket: Promise<void>;
  openingStatus?: string;
  wsRef: React.RefObject<WebSocket | null>;
  description?: string;
}

const getDrSummary = async (
  name: string,
  formatted_address: string,
  place_id: string
) => {
  const formData = await JSON.parse(localStorage.getItem("formData"));
  const data = {
    name,
    formatted_address,
    place_id,
    request_id: formData?.request_id,
  };

  try {
    const resp = await axios.post(
      `https://callai-backend-243277014955.us-central1.run.app/api/get_doctor_summary`,
      data
    );
    // console.log(resp?.data)
    return (
      resp.data?.result?.summary || "No summary available for this provider."
    );
  } catch (error) {
    console.error("Error fetching doctor summary:", error);
    return "Unable to fetch summary information.";
  }
};
export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  index,
  id,
  onSkip,
  onCallNext,
  activeCallIndex,
  isAppointmentBooked,
  callStatus,
  setTranscriptSummary,
  setTranscriptLoading,
  transcriptSummary,
  transcriptLoading,
  openingStatus,
  reconnectWebSocket,
  wsRef,
  description = "",
}) => {
  const { expandedId, setExpandedId } = useExpand();
  const [doctorSummary, setDoctorSummary] = useState(description);

  const isExpanded = expandedId === id;
  //console.log(expandedId, id);
  // console.log("DoctorCard", doctor);
  const handleExpand = async () => {
    if (isExpanded) {
      setExpandedId(null);
      setTranscriptLoading(false);
    } else {
      setTranscriptLoading(true);
      setTranscriptSummary({ place_id: id, summary: "" });
      setExpandedId(id);

      const formData = await JSON.parse(localStorage.getItem("formData"));
      const request_id = formData?.request_id;

      try {
        // Fetch the summary
        const resp = await getDrSummary(
          doctor.name,
          doctor.address,
          id,
          request_id
        );
        console.log("API Response:", resp);

        // Set the summary after a timeout
        setTimeout(() => {
          console.log("Setting transcript summary...");
          setTranscriptLoading(false);
          setTranscriptSummary({ place_id: id, summary: resp });
        }, 5000);

        // Check WebSocket connection
        if (wsRef.current?.readyState === 1) {
          console.log("WebSocket is connected.");
        } else {
          console.log("Reconnecting WebSocket...");
          reconnectWebSocket();
        }
      } catch (error) {
        console.error("Error fetching doctor summary:", error);
        setTranscriptLoading(false);
        setTranscriptSummary({
          place_id: id,
          summary: "Unable to fetch summary information.",
        });
      }
    }
  };

  return (
    <>
      {/* Web View (Existing Layout) */}
      <article className="hidden md:flex py-2 gap-2 w-full mb-3 last:mb-0">
        <div className="flex md:gap-2 gap-0">
          <div className="flex  md:gap-2 gap-0 items-center">
            <span className="hidden bg-[#0074BA] rounded-full w-8 h-8 my-4 sm:w-6 sm:h-6 text-white md:flex items-center justify-center text-xs sm:text-sm font-medium">
              {index + 1}
            </span>
          </div>
        </div>
        <div className="bg-[#F2F6F9] py-4 md:px-3  px-3 rounded-md flex flex-col gap-4 w-full min-w-[90vw] md:min-w-0 ">
          <div className="flex flex-col gap-2 font-normal w-full">
            <div className="flex justify-between ">
              <div className="flex flex-grow items-start gap-2 md:hidden w-full  ">
                <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
                  {index + 1}
                </span>

                <div className="block w-full  sm:max-w-full whitespace-normal overflow-hidden text-ellipsis cursor-pointer font-medium text-base leading-snug break-words">
                  {doctor.isSponsored && (
                    <span className="text-xs tracking-tight">Sponsored</span>
                  )}
                  <h3
                    className="text-base font-medium tracking-tight"
                    onClick={handleExpand}
                  >
                    {doctor.name}
                  </h3>
                </div>
              </div>

              <div className="cursor-pointer font-medium text-base sm:text-base hidden md:block ">
                {doctor.isSponsored && (
                  <span className="text-xs tracking-tight">Sponsored</span>
                )}
                <h3
                  className="text-base font-medium tracking-tight"
                  onClick={handleExpand}
                >
                  {doctor.name}
                </h3>
              </div>
              <div className="flex justify-between items-center w-full sm:w-auto max-md:max-w-full ">
                <div className="">
                  <LocationInfo
                    rating={doctor.rating}
                    reviews={doctor.reviews}
                    distance={doctor.distance}
                    address={doctor.address}
                    waitTime={doctor.waitTime}
                    appointments={doctor.appointments}
                  />
                </div>
                <div className="ml-auto w-[190px] min-w-[190px] flex justify-end items-center h-full ">
                  <StatusBadge
                    status={doctor.status}
                    index={index}
                    onSkip={onSkip}
                    onCallNext={onCallNext}
                    activeCallIndex={activeCallIndex}
                    callStatus={callStatus}
                    openingStatus={openingStatus}
                    isAppointmentBooked={isAppointmentBooked}
                  />
                </div>
              </div>
            </div>
            <h3 className="text-sm  text-[#636465] tracking-tight">
              {doctor.address}
            </h3>
            <div className=" gap-1 text-sm text-[#333333] flex">
              <span
                className={
                  doctor.opening_hours?.status === "Open"
                    ? "text-[#00BA85]"
                    : "text-[#E5573F]"
                }
              >
                {doctor.opening_hours?.status || "N/A"}
              </span>
              <span>•</span>
              <span>{doctor.opening_hours?.time_info || "Unavailable"}</span>
            </div>

            <div className=" md:table-cell">
              <button
                type="button"
                onClick={handleExpand}
                className="hover:text-gray-700 transition-colors cursor-pointer block"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {!isExpanded && (
                  <span className="mx-auto text-sm underline">view more</span>
                )}
              </button>
              {/* 
                    <button
                      type="button"
                      onClick={handleExpand}
                      className=" hover:text-gray-700 transition-colors cursor-pointer  block"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {transcriptLoading &&
                      transcriptSummary?.place_id === id ? (
                        <Loader2 className="mx-auto animate-spin" size={18} />
                      ) : isExpanded ? (
                        <span className="mx-auto text-sm underline hidden">
                          view less
                        </span>
                      ) : (
                        <span className="mx-auto text-sm underline ">
                          view more
                        </span>
                      )}
                    </button> */}
            </div>
            {isExpanded && (
              <div className="md:!table-row w-full bg-[#F2F6F9]  ">
                <div colSpan={5} className=" p-4 transition-all bg-[#F2F6F9]">
                  <div className="text-sm text-gray-600 animate-fadeIn bg-[#F2F6F9]">
                    {transcriptLoading && transcriptSummary?.place_id === id ? (
                      <div className="flex items-center justify-center py-4 bg-[#F2F6F9] ">
                        <LoadingSumamry />
                      </div>
                    ) : (
                      <span className="text-xs tracking-tight leading-5 text-zinc-800 bg-[#F2F6F9]">
                        {transcriptSummary?.summary ??
                          doctorSummary ??
                          "No summary available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="flex justify-start text-start items-center">
                <button
                  onClick={handleExpand}
                  className="text-sm underline mt-4"
                >
                  view less
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 mt-6 h-px border border-solid border-black border-opacity-10" />
      </article>

      {/* Mobile View (New Card Design) */}
      {/* Mobile View (New Card Design) */}
      <article className="flex md:hidden flex-col w-full bg-white shadow-md">
        {/* Top Section: Avatar + Name in a Card Style */}
        <div className="flex gap-2 py-2">
          {/* <div
            className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
            style={{ backgroundColor: getAlternateColor(index) }}
          >
            {doctor?.name.charAt(0)}
          </div> */}
          <div className="flex items-center mr-1">
            <div className="md:flex items-center hidden justify-center mr-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                alt="Input design element"
                className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3"
              />
            </div>
            <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
              {index + 1}
            </span>
          </div>
          <div className="flex flex-col flex-grow bg-[#F2F6F9] p-3 rounded-md">
            <h3
              className="text-base break-words"
              onClick={handleExpand}
              onPointerDown={(e) => e.stopPropagation()}
              type="button"
            >
              {doctor.name}
            </h3>
            {doctor.isSponsored && (
              <span className="text-xs text-gray-500 tracking-tight">
                Sponsored
              </span>
            )}
            <h3 className="text-sm pt-2  text-[#636465] tracking-tight">
              {doctor.address}
            </h3>
            <div className="gap-2 mt-2">
              <LocationInfo
                rating={doctor.rating}
                reviews={doctor.reviews}
                distance={doctor.distance}
                address={doctor.address}
                waitTime={doctor.waitTime}
                appointments={doctor.appointments}
              />
            </div>
            <div className=" md:table-cell">
              <button
                type="button"
                onClick={handleExpand}
                className="hover:text-gray-700 transition-colors cursor-pointer block"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {!isExpanded && (
                  <span className="mx-auto text-sm underline">view more</span>
                )}
              </button>
            </div>
            {isExpanded && (
              <div className="md:!table-row w-full bg-[#F2F6F9]  ">
                <div colSpan={5} className=" p-4 transition-all bg-[#F2F6F9]">
                  <div className="text-sm text-gray-600 animate-fadeIn bg-[#F2F6F9]">
                    {transcriptLoading && transcriptSummary?.place_id === id ? (
                      <div className="flex items-center justify-center py-4 bg-[#F2F6F9] ">
                        <LoadingSumamry />
                      </div>
                    ) : (
                      <span className="text-xs tracking-tight leading-5 text-zinc-800 bg-[#F2F6F9]">
                        {transcriptSummary?.summary ??
                          doctorSummary ??
                          "No summary available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="flex justify-start text-start items-center">
                <button
                  onClick={handleExpand}
                  className="text-sm underline mt-4"
                >
                  view less
                </button>
              </div>
            )}
            <div className="mt-2 mr-4 flex self-end">
              <StatusBadge
                status={doctor.status}
                index={index}
                onSkip={onSkip}
                onCallNext={onCallNext}
                activeCallIndex={activeCallIndex}
                callStatus={callStatus}
                openingStatus={openingStatus}
                isAppointmentBooked={isAppointmentBooked}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}

        {/* Status Badge */}
      </article>
    </>
  );
};
