/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";

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
  doctorType?: string;
  activeCallIndex: number;
  address: string;
  isAppointmentBooked: boolean;
  callStatus: {
    isInitiated: boolean;
  };
  onDelete: (id: string) => void; // Function to delete item
}

const getAlternateColor = (index: number) => {
  const colors = ["#F7D07D", "#A0F1C2"]; // Gold & Light Green
  return colors[index % 2]; // Alternate based on index
};

export const Task: React.FC<TaskProps> = ({
  id,
  title,
  rating,
  review,
  vicinity,
  address,
  index,
  activeCallIndex,
  distance,
  website,
  isAppointmentBooked,
  callStatus,
  doctorType,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isSelected, setIsSelected] = useState(true);
  const [open, setOpen] = useState(false);

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
        className={`transition-all duration-300 w-full ${
          index % 2 === 0 ? "bg-white" : "bg-blue-50"
        } md:table-row block rounded-lg md:rounded-none p-4 md:p-0`}
      >
        <td className="hidden"></td>
        <td className=" md:hidden flex flex-col gap-4 ">
          {" "}
          <div className="flex gap-4">
            <div className="flex items-start">
              <div className="md:flex items-center hidden  mr-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                  alt="Input design element"
                  className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3"
                />
              </div>
              <span className="bg-[#00BA85] rounded-full w-5 h-5 sm:w-6 sm:h-6 text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                {index + 1}
              </span>
            </div>
            <div className="flex  gap-3">
              {/* Number & Input Design Element */}

              {/* Avatar with Dynamic Background Color */}
              {/* <div
              className="rounded-full text-black flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              style={{ backgroundColor: getAlternateColor(index) }}
            >
              {title.charAt(0)}
            </div> */}

              {/* Doctor Info */}
              <div className="flex md:flex-col flex-col justify-between ">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer font-medium text-sm sm:text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    track("Dr_Website_Clicked");
                  }}
                >
                  {title}
                </a>
                <div className="flex flex-col text-[#333] text-xs sm:text-sm pt-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                      className="object-contain w-3 rounded-sm"
                      alt="Rating star"
                    />
                    <span className="whitespace-nowrap">
                      {rating !== undefined ? rating : "-"}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap">
                      {review || 0} reviews
                    </span>
                    <span className="whitespace-nowrap md:hidden block">•</span>

                    <span className="whitespace-nowrap md:hidden block">
                      {distance || "-"}
                    </span>
                  </div>
                  <div className="flex flex-grow items-center gap-x-2 gap-y-1 text-gray-500 text-xs">
                    <MapPin size={13} />
                    <span className=" md:block hidden">
                      {distance || "-"}
                    </span>
                    <span className=" md:block hidden">•</span>
                    <span className="">{vicinity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex mr-10 ml-auto md:ml-0 pl-4"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" />
          </button>
        </td>
        {/* Combined Number, Avatar, and Doctor Info all in one cell */}
        <td className="p-2 ">
          <div className=" hidden md:flex items-center gap-3">
            <div className="flex items-center mr-1">
              <div className="md:flex items-center hidden  mr-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                  alt="Input design element"
                  className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3"
                />
              </div>
              <span className="bg-[#00BA85] rounded-full w-5 h-5 sm:w-6 sm:h-6 text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                {index + 1}
              </span>
            </div>
            {/* Number & Input Design Element */}

            {/* Avatar with Dynamic Background Color */}
            {/* <div
              className="rounded-full text-black flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              style={{ backgroundColor: getAlternateColor(index) }}
            >
              {title.charAt(0)}
            </div> */}

            {/* Doctor Info */}
            <div className="flex md:flex-col flex-row justify-between items-center md:text-center">
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer font-medium text-sm sm:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  track("Dr_Website_Clicked");
                }}
              >
                {title}
              </a>
            </div>
          </div>
        </td>

        {/* Ratings & Location */}
        <td className=" p-2 min-w-[160px]">
          <div className="hidden md:flex  flex-col text-[#333] text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                className="object-contain w-3 rounded-sm"
                alt="Rating star"
              />
              <span className="whitespace-nowrap">
                {rating !== undefined ? rating : "-"}
              </span>
              <span>•</span>
              <span className="whitespace-nowrap">{review || 0} reviews</span>
              <span className="whitespace-nowrap md:hidden block">•</span>

              <span className="whitespace-nowrap md:hidden block">
                {distance || "-"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500 text-xs">
              <MapPin size={13} />
              <span className="whitespace-nowrap md:block hidden">
                {distance || "-"}
              </span>
              <span className="whitespace-nowrap md:block hidden">•</span>
              <span className="whitespace-nowrap">{vicinity}</span>
            </div>
          </div>
        </td>

        {/* Delete Button */}
        <td className="p-2 text-center">
          <button
            onClick={() => setOpen(true)}
            className="md:self-end ml-auto md:ml-0 px-4 hidden md:flex"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" />
          </button>
        </td>
      </tr>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg h-52">
          <DialogHeader>
            <DialogTitle>Remove from List</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-between gap-6">
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
