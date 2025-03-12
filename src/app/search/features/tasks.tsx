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

interface TaskProps {
  id: string;
  title: string;
  rating?: number;
  website: string;
  distance?: string;
  index: number;
  review?: number;
  vicinity: string;
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

        {/* Combined Number, Avatar, and Doctor Info all in one cell */}
        <td className="p-2">
          <div className="flex items-center gap-3">
            {/* Number & More Icon */}
            <div className="flex items-center mr-1">
              <div className="md:flex items-center hidden  justify-center mr-2">
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

            {/* Avatar with Dynamic Background Color */}
            <div
              className="rounded-full text-black flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              style={{ backgroundColor: getAlternateColor(index) }}
            >
              {title.charAt(0)}
            </div>

            {/* Doctor Info */}
            <div className="flex md:flex-col flex-row justify-between items-center text-center">
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer font-medium text-sm sm:text-base"
                onClick={(e) => e.stopPropagation()}
              >
                {title}
              </a>
              {/* <span className="text-xs sm:text-sm text-gray-600">{doctorType}</span> */}
              <span className="p-2 text-center md:hidden ml-auto ">
                <button
                  onClick={() => setOpen(true)}
                  className="md:hidden  self-end flex ml-8"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Trash2 className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" />
                </button>
              </span>
            </div>
          </div>
        </td>

        {/* Ratings & Location */}
        <td className="p-2 min-w-[160px] md:ml-0 ml-10">
          <div className="flex flex-col text-[#333] text-xs sm:text-sm">
            <div className="flex flex-row items-center gap-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
                className="object-contain w-3 rounded-sm aspect-[1.09] max-md:mr-3.5"
                alt="Rating star"
              />
              <span>{rating !== undefined ? rating : "-"}</span>
              <span>•</span>
              <span>{review || 0} reviews</span>
            </div>
            <div className="flex flex-row items-center gap-x-2 text-gray-500 text-xs">
              <MapPin size={13} />
              <span>{distance || "-"}</span>
              <span>•</span>
              <span>{vicinity}</span>
            </div>
          </div>
        </td>

        {/* Delete Button */}
        <td className="p-2 text-center   ">
          <button
            onClick={() => setOpen(true)}
            className="md:flex  self-end hidden"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" />
          </button>
        </td>
      </tr>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg  h-52">
          <DialogHeader>
            <DialogTitle>Remove from List</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-between gap-6">
            <Button
              variant="secondary"
              className="w-1/2 rounded-md "
              onClick={() => setOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              No
            </Button>
            <Button
              variant="destructive"
              className="w-1/2 rounded-md "
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
