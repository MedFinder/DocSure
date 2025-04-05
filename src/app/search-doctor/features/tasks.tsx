/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import { useState, useEffect, createContext, useContext } from "react";
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
  callStatus: {
    isInitiated: boolean;
  };
  onDelete: (id: string) => void; // Function to delete item
  description?: string; // Optional description/summary field
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
  const data = {
    name,
    formatted_address,
    place_id,
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
  onDelete,
  description = "",
  //description = "No additional information available for this provider.", // Default description
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isSelected, setIsSelected] = useState(true);
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(openingStatus === "Open");
  // Use the expand context instead of local state
  const { expandedId, setExpandedId } = useExpand();
  const isExpanded = expandedId === id;

  const [doctorSummary, setDoctorSummary] = useState(description);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryFetched, setSummaryFetched] = useState(false);

  // Function to handle expanding and fetching summary
  const handleExpand = async (e) => {
    e.stopPropagation();

    // Toggle expanded state - close if already open, otherwise open this one and close others
    if (isExpanded) {
      setExpandedId(null);
    } else {
      setExpandedId(id);

      // If expanding and haven't fetched summary yet, get it
      if (!summaryFetched) {
        setIsLoading(true);
        try {
          const summary = await getDrSummary(
            title,
            formatted_address || address || vicinity,
            place_id || id
          );
          setDoctorSummary(summary);
          setSummaryFetched(true);
        } catch (error) {
          console.error("Error fetching doctor summary:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const renderedSummary = useTypewriterEffect(doctorSummary, 20);

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="transition-all duration-300 w-full py-4 "
      >
        <td className="flex  md:table-cell    ">
          <TooltipProvider>
            <div className="flex  md:gap-2 gap-2 ">
              <div className="flex md:gap-2 gap-0">
                <div className="flex  md:gap-2 gap-0 items-center">
                  {index < 10 ? (
                    <span className="hidden bg-[#0074BA] rounded-full w-8 h-8 my-4 sm:w-6 sm:h-6 text-white md:flex items-center justify-center text-xs sm:text-sm font-medium">
                      {index + 1}
                    </span>
                  ) : (
                    <span className="md:w-6 md:h-6 md:my-4 " /> // Empty space with same dimensions
                  )}
                </div>
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
                    <span className="font-semibold">Tooltip example:</span>
                    <span>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="bg-[#F2F6F9] py-4 md:px-2  px-3 rounded-md flex gap-4 w-full min-w-[90vw] md:min-w-0 hover:bg-gray-200">
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
                    <span className="font-semibold">Tooltip example:</span>
                    <span>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </span>
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-col gap-2 font-normal w-full">
                  <div className="flex justify-between ">
                    <div className="flex items-start gap-2 md:hidden w-full ">
                      {index < 10 ? (
                        <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
                          {index + 1}
                        </span>
                      ) : null}

                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer font-medium  text-base leading-snug break-words w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          track("Dr_Website_Clicked");
                        }}
                      >
                        {title}
                      </a>
                    </div>

                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer font-medium text-base sm:text-base hidden md:block "
                      onClick={(e) => {
                        e.stopPropagation();
                        track("Dr_Website_Clicked");
                      }}
                    >
                      {title}
                    </a>
                    <div className="flex gap-16 pr-2">
                      <div className="md:flex gap-1 font-normal text-[#333333] text-sm items-center hidden">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                          className="object-contain w-3 rounded-sm"
                          alt="Rating star"
                        />
                        <span className="whitespace-nowrap">
                          {rating !== undefined ? rating : "-"}
                        </span>
                        <span>•</span>
                        <span className="whitespace-nowrap underline">
                          {review || 0} reviews
                        </span>
                      </div>
                      <div className="md:flex hidden items-center gap-1">
                        <MapPin size={13} />
                        <span className="whitespace-nowrap text-[#333333] text-sm">
                          {distance || "-"}
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <input
                            type="checkbox"
                            className="w-8 h-5 accent-[#00BA85] rounded-md checked:text-white"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          className="bg-[#0074BA] text-white p-4 w-60 flex flex-col gap-2"
                        >
                          <span className="font-semibold">
                            Tooltip example:
                          </span>
                          <span>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm text-[#636465]">
                    {vicinity}
                  </span>
                  <div className="flex gap-1 font-normal text-[#333333] text-sm items-center md:hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                      className="object-contain w-3 rounded-sm"
                      alt="Rating star"
                    />
                    <span className="whitespace-nowrap">
                      {rating !== undefined ? rating : "-"}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap underline">
                      {review || 0} reviews
                    </span>
                    <span className="px-1">|</span>

                    <div className="md:hidden gap-1 text-sm text-[#333333] flex  ">
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
                    <span>{openingTimeInfo}</span>
                  </div>
                  <div className=" md:table-cell">
                    <button
                      type="button"
                      onClick={handleExpand}
                      className=" hover:text-gray-700 transition-colors cursor-pointer  block"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {isLoading ? (
                        <Loader2 className="mx-auto animate-spin" size={18} />
                      ) : isExpanded ? (
                        <span className="mx-auto text-sm underline hidden">
                          view less
                        </span>
                      ) : (
                        <span className="mx-auto text-sm underline">
                          view more
                        </span>
                      )}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="md:!table-row w-full">
                      <div
                        colSpan={5}
                        className="bg-gray-50 p-4 transition-all"
                      >
                        <div className="text-sm text-gray-600 animate-fadeIn">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <LoadingSumamry />
                            </div>
                          ) : (
                            <span className="text-xs tracking-tight leading-5  text-zinc-800">
                              {renderedSummary}
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
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        view less
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TooltipProvider>
        </td>

        {/* Expand/Collapse Button - New Column */}
        {/* <td className="p-2 text-center hidden md:table-cell">
          <button
            onClick={handleExpand}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer hidden md:block"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <Loader2 className="mx-auto animate-spin" size={18} />
            ) : isExpanded ? (
              <ChevronUp className="mx-auto" size={18} />
            ) : (
              <ChevronDown className="mx-auto" size={18} />
            )}
          </button>
        </td> */}
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
