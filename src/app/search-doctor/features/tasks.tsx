/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import useTypewriterEffect from "@/hooks/useTypewriterEffect";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "@/app/transcript-new/StatusBadge";

const LoadingSumamry = dynamic(
  () => import("../../../components/Loading/LoadingSummary"),
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

interface TaskProps {
  id: string;
  title: string;
  rating?: number;
  website: string;
  distance?: string;
  index: number;
  review?: number;
  vicinity: string;
  formatted_address: string;
  place_id?: string;
  doctorType?: string;
  activeCallIndex: number;
  address: string;
  openingStatus?: string;
  openingTimeInfo?: string;
  isAppointmentBooked: boolean;
  transcriptSummary?: { place_id: string; summary: string };
  transcriptLoading?: boolean;
  setTranscriptSummary: ({ place_id: string, summary: string }) => void;
  setTranscriptLoading: (loading: boolean) => void;
  wsRef: React.RefObject<WebSocket | null>;
  fromTranscript?: boolean;
  reconnectWebSocket: Promise<void>;
  callStatus: {
    isInitiated: boolean;
  };
  onDelete: (id: string) => void; // Function to delete item
  description?: string; // Optional description/summary field
  onSkip?: () => void; // Function to skip the item
  handleRemoveDoctor?: (index: string) => void; // Added for "Remove" functionality
  onCallNext?: (index: number) => void; // Function to move doctor to next in queue
}

const getAlternateColor = (index: number) => {
  const colors = ["#F7D07D", "#A0F1C2"]; // Gold & Light Green
  return colors[index % 2]; // Alternate based on index
};
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

export const Task: React.FC<TaskProps> = ({
  id,
  title,
  rating,
  review,
  vicinity,
  address,
  formatted_address,
  place_id,
  index,
  activeCallIndex,
  distance,
  website,
  isAppointmentBooked,
  callStatus,
  doctorType,
  openingStatus,
  openingTimeInfo,
  transcriptSummary,
  transcriptLoading,
  setTranscriptSummary,
  setTranscriptLoading,
  wsRef,
  fromTranscript,
  reconnectWebSocket,
  onDelete,
  description = "",
  onSkip,
  onCallNext,
  handleRemoveDoctor,
  //description = "No additional information available for this provider.", // Default description
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isSelected, setIsSelected] = useState(true);
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(() => {
    // Only check items that are both open and within the first 10
    return index < 10 && openingStatus === "Open";
  });

  const { expandedId, setExpandedId } = useExpand();
  const isExpanded = expandedId === id;

  const [doctorSummary, setDoctorSummary] = useState(description);
  // Function to handle expanding and fetching summary
  const handleExpand = async (e) => {
    e.stopPropagation();

    // Toggle expanded state - close if already open, otherwise open this one and close others
    if (isExpanded) {
      setTranscriptSummary({ place_id: id, summary: "" });
      setExpandedId(null);
      setTranscriptLoading(false);
    } else {
      setTranscriptLoading(true);
      setTranscriptSummary({ place_id: id, summary: "" });
      setExpandedId(id);

      // Get request_id from session storage
      const formData = await JSON.parse(localStorage.getItem("formData"));
      const request_id = formData?.request_id;
      try {
        // Initial fetch to trigger the summary generation
        const resp = await getDrSummary(
          title,
          formatted_address || address || vicinity,
          place_id || id,
          request_id
        );
        //console.log(resp);
        setTimeout(() => {
          console.log("defaulting to dr summary..after socket time out");
          setTranscriptLoading(false);
          setTranscriptSummary({ place_id: id, summary: resp });
        }, 5000);
        if (wsRef.current?.readyState === 1) {
          // setTranscriptLoading(false);
          // setTranscriptSummary({place_id: id, summary: resp})
        } else {
          console.log("reconnecitng web socket...");
          reconnectWebSocket();
        }
        console.log("Websocket state is", wsRef.current?.readyState);
      } catch (error) {
        console.error("Error fetching doctor summary:", error);
        setDoctorSummary("Unable to fetch summary information.");
      }
    }
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="transition-all duration-300 w-full py-4  "
        // type="button"
        // onClick={handleExpand}
        // onPointerDown={(e) => e.stopPropagation()}
      >
        <td className={`flex md:table-cell ${fromTranscript ? "!px-0" : ""}`}>
          <TooltipProvider>
            <div className="flex  md:gap-2 gap-2   ">
              <div className="flex md:gap-2 gap-0 ">
                <div className="flex  md:gap-2 gap-0 items-center ">
                  {index < 10 ? (
                    <span className="hidden bg-[#0074BA] rounded-full w-8 h-8 my-4 sm:w-6 sm:h-6 text-white md:flex items-center justify-center text-xs sm:text-sm font-medium">
                      {index + 1}
                    </span>
                  ) : (
                    <span className="md:w-6 md:h-6 md:my-4 " /> // Empty space with same dimensions
                  )}
                </div>

                {fromTranscript ? (
                  <div className="md:hidden flex justify-center items-center">
                    {index < 10 ? (
                      <span className="bg-[#0074BA] rounded-full w-5 h-5 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
                        {index + 1}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                        alt="Input design element"
                        className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3 md:hidden block"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-[#0074BA] text-white p-4 w-60 flex flex-col gap-2"
                    >
                      <span>Select doctors to call for an appointment.</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div
                className={`bg-[#F2F6F9]  py-4 md:px-2 px-3 rounded-md flex gap-4 w-full min-w-[90vw] md:min-w-0   ${
                  fromTranscript ? "md:px-6 min-w-[85vw] " : ""
                }`}
              >
                {!fromTranscript && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                        alt="Input design element"
                        className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3 hidden md:block"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-[#0074BA] text-white p-4 w-60 flex flex-col gap-2"
                    >
                      {/* <span className="font-semibold">Tooltip example:</span> */}
                      <span>Drag items to reorder the priority.</span>
                    </TooltipContent>
                  </Tooltip>
                )}
                <div className="flex flex-col gap-2 font-normal w-full  pl-0">
                  <div className="flex justify-between ">
                    <div className="flex flex-grow items-start gap-2 md:hidden w-full  ">
                      {!fromTranscript &&
                        (index < 10 ? (
                          <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
                            {index + 1}
                          </span>
                        ) : (
                          <span className="md:w-6 md:h-6 md:my-4 " />
                        ))}

                      <p
                        // href={website}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        className="block w-full  sm:max-w-full whitespace-normal overflow-hidden text-ellipsis cursor-pointer font-medium text-base leading-snug break-words"
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   track("Dr_Website_Clicked");
                        // }}
                        type="button"
                        onClick={handleExpand}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {title}
                      </p>
                    </div>

                    <p
                      // href={website}
                      // target="_blank"
                      // rel="noopener noreferrer"
                      className="cursor-pointer font-medium text-base sm:text-base hidden md:block "
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   track("Dr_Website_Clicked");
                      // }}
                      type="button"
                      onClick={handleExpand}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {title}
                    </p>
                    <div className="flex gap-16 pr-2">
                      <div className="md:flex  gap-1 font-normal text-[#333333] text-sm items-center hidden">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                          className="object-contain w-3 rounded-sm"
                          alt="Rating star"
                        />
                        <span className="whitespace-nowrap">
                          {rating !== undefined ? rating : "-"}
                        </span>
                        <span>•</span>
                        <span className="whitespace-nowrap ">
                          {review || 0} reviews
                        </span>
                      </div>
                      <div className="md:flex hidden items-center gap-1">
                        <MapPin size={13} />
                        <span className="whitespace-nowrap text-[#333333] text-sm">
                          {distance || "-"}
                        </span>
                      </div>
                      {!fromTranscript && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <label>
                              <TooltipTrigger asChild>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <div className="relative w-6 h-6">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setIsChecked(e.target.checked);
                                      }}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      className="appearance-none w-full h-full bg-white border border-gray-300 rounded-md 
                  checked:bg-[#00BA85] checked:border-transparent"
                                    />

                                    {/* White checkmark */}
                                    {isChecked && (
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

                                {/* White checkmark overlay */}
                              </TooltipTrigger>
                            </label>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="bg-[#0074BA] text-white p-4 w-60 flex flex-col gap-2"
                          >
                            {/* <span className="font-semibold">
                            Tooltip example:
                          </span> */}
                            <span>
                              {isChecked
                                ? "Deselect doctors you don’t want us to call."
                                : "Select doctors to call for an appointment."}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <span className=" text-sm text-[#636465]  pr-16 md:pr-0">
                    {vicinity}
                  </span>
                  <div className="flex gap-1 font-normal text-[#333333] text-sm items-center md:hidden flex-grow break-words">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                      className="object-contain w-3 rounded-sm"
                      alt="Rating star"
                    />
                    <span className="whitespace-nowrap">
                      {rating !== undefined ? rating : "-"}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap ">
                      {review || 0} reviews
                    </span>
                    <span className="px-1">|</span>

                    <div className="md:hidden gap-1 text-sm text-[#333333] flex items-center  ">
                      <span
                        className={
                          openingStatus === "Open"
                            ? "text-[#00BA85]"
                            : "text-[#E5573F]"
                        }
                      >
                        {openingStatus}
                      </span>
                      <span>•</span>
                      <span>{openingTimeInfo}</span>
                    </div>
                  </div>
                  <div className="md:flex gap-1 text-sm text-[#333333]  hidden ">
                    <span
                      className={
                        openingStatus === "Open"
                          ? "text-[#00BA85]"
                          : "text-[#E5573F]"
                      }
                    >
                      {openingStatus}
                    </span>
                    <span>•</span>
                    <span className="">{openingTimeInfo}</span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <button
                      type="button"
                      onClick={handleExpand}
                      className="hover:text-gray-700 transition-colors cursor-pointer block"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {!isExpanded && (
                        <span className="mx-auto text-sm underline">
                          view more
                        </span>
                      )}
                    </button>
                    {!isExpanded && fromTranscript && (
                      <div className="md:flex justify-end items-center hidden ">
                        <StatusBadge
                          status={"queue"}
                          index={index}
                          onSkip={onSkip}
                          onCallNext={onCallNext}
                          onRemove={() =>
                            handleRemoveDoctor && handleRemoveDoctor(index)
                          }
                          activeCallIndex={activeCallIndex}
                          callStatus={callStatus}
                          isAppointmentBooked={isAppointmentBooked}
                          openingStatus={openingStatus}
                        />
                      </div>
                    )}
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
                  <div className="pr-6 md:hidden  flex justify-start">
                    {!isExpanded && fromTranscript && (
                      <div className="flex justify-start items-center">
                        <StatusBadge
                          status={"queue"}
                          index={index}
                          onSkip={onSkip}
                          onCallNext={onCallNext}
                          onRemove={() =>
                            handleRemoveDoctor && handleRemoveDoctor(index)
                          }
                          activeCallIndex={activeCallIndex}
                          callStatus={callStatus}
                          isAppointmentBooked={isAppointmentBooked}
                          openingStatus={openingStatus}
                        />
                      </div>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="md:!table-row w-full bg-[#F2F6F9]  pr-16 md:pr-0 ">
                      <div
                        colSpan={5}
                        className=" p-4 transition-all bg-[#F2F6F9]"
                      >
                        <div className="text-sm text-gray-600 animate-fadeIn md:w-2/3">
                          {transcriptLoading &&
                          transcriptSummary?.place_id === id ? (
                            <div className="flex items-center justify-center py-4 bg-[#F2F6F9] ">
                              <LoadingSumamry />
                            </div>
                          ) : (
                            <div className="text-xs tracking-tight leading-5 text-zinc-800 bg-[#F2F6F9]">
                              {(transcriptSummary?.summary ?? doctorSummary)
                                // Split the content for processing
                                .split(
                                  /(\*\*[^*]+\*\*:?|(?:^|\n)- \*\*[^*\n]*\*\*:?|(?:^|\n)- (?:\*\*)?[^*\n]*(?:\*\*)?)/g
                                )
                                .map((part, index) => {
                                  // Handle any text wrapped in ** (as h2 heading regardless of format)
                                  if (part.match(/^\*\*.*\*\*:?$/)) {
                                    // Extract text between the ** markers (with or without colon)
                                    const headingText = part
                                      .replace(/^\*\*/, "")
                                      .replace(/\*\*:?$/, "");
                                    return (
                                      <h2
                                        key={index}
                                        className="font-bold text-sm mt-3 mb-1"
                                      >
                                        {headingText}
                                      </h2>
                                    );
                                  }
                                  // Handle special bullet points with bold text (subheadings)
                                  else if (
                                    part.match(/^(\n)?- \*\*.*\*\*:?$/)
                                  ) {
                                    // Extract text between the ** markers after the dash
                                    const headingText = part
                                      .replace(/^(\n)?- \*\*/, "")
                                      .replace(/\*\*:?$/, "");
                                    return (
                                      <h2
                                        key={index}
                                        className="font-bold text-sm mt-3 mb-1"
                                      >
                                        {headingText}
                                      </h2>
                                    );
                                  }
                                  // Handle bullet points with bold text (starting with "-**")
                                  else if (part.match(/^(\n)?- \*\*.*\*\*$/)) {
                                    // Extract text between the ** markers after the dash
                                    const bulletText = part
                                      .replace(/^(\n)?- \*\*/, "")
                                      .replace(/\*\*$/, "");
                                    return (
                                      <div
                                        key={index}
                                        className="ml-2 mt-1 flex"
                                      >
                                        <span className="mr-1">•</span>
                                        <span className="font-bold">
                                          {bulletText}
                                        </span>
                                      </div>
                                    );
                                  }
                                  // Handle regular bullet points (text starting with dash)
                                  else if (part.match(/^(\n)?- /)) {
                                    const bulletText = part.replace(
                                      /^(\n)?- /,
                                      ""
                                    );
                                    return (
                                      <div
                                        key={index}
                                        className="ml-2 mt-1 flex"
                                      >
                                        <span className="mr-1">•</span>
                                        <span>{bulletText}</span>
                                      </div>
                                    );
                                  }
                                  // Regular text
                                  else {
                                    return <span key={index}>{part}</span>;
                                  }
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {isExpanded && fromTranscript && (
                    <div className="flex justify-between text-start items-center">
                      <button
                        onClick={handleExpand}
                        className="text-sm underline mt-4"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        view less
                      </button>
                      <div className="md:flex hidden justify-end items-center">
                        <StatusBadge
                          status={"queue"}
                          index={index}
                          onSkip={onSkip}
                          onCallNext={onCallNext}
                          onRemove={() =>
                            handleRemoveDoctor && handleRemoveDoctor(index)
                          }
                          activeCallIndex={activeCallIndex}
                          callStatus={callStatus}
                          openingStatus={openingStatus}
                          isAppointmentBooked={isAppointmentBooked}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TooltipProvider>
        </td>
      </tr>

      {/* Expandable Description Panel - only visible on desktop */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg h-52 ">
          <DialogHeader>
            <DialogTitle>Remove from List</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this item?
          </p>
          <div className="md:flex  flex  justify-between gap-6">
            <Button
              variant="secondary"
              className="w-1/2 rounded-md"
              onClick={() => setOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              No
            </Button>
            <Button
              variant="destructive"
              className="w-1/2 rounded-md"
              onClick={() => onDelete(id)} // Trigger delete
              onPointerDown={(e) => e.stopPropagation()}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const TaskList = ({ children }) => {
  return <ExpandProvider>{children}</ExpandProvider>;
};
