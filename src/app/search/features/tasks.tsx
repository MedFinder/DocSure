/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete, MapPin, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import More from "../../../../public/more.png";
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
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-all duration-300 ${
        index % 2 === 0 ? "bg-white" : "bg-blue-50"
      }`}
    >
      <td className="hidden"></td>

      {/* Number & More Icon */}
      <td>
        <div className="flex justify-evenly w-full">
          {More && (
            <div className="flex items-center justify-center">
              <Image alt="More" src={More} className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          )}
          <span className="bg-[#00BA85] rounded-full w-5 h-5 sm:w-7 sm:h-7 text-white flex items-center justify-center text-xs sm:text-sm font-medium">
            {index + 1}
          </span>
        </div>
      </td>

      {/* Avatar with Dynamic Background Color */}
      <td className="p-2 text-center">
        <div
          className="rounded-full text-black flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12"
          style={{ backgroundColor: getAlternateColor(index) }}
        >
          {title.charAt(0)}
        </div>
      </td>

      {/* Doctor Info */}
      <td className="p-2 min-w-[140px]">
        <div className="flex flex-col">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-semibold text-sm sm:text-base"
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </a>
          <span className="text-xs sm:text-sm text-gray-600">{doctorType}</span>
        </div>
      </td>

      {/* Ratings & Location */}
      <td className="p-2 min-w-[160px]">
        <div className="flex flex-col text-[#333] text-xs sm:text-sm">
          <div className="flex flex-row items-center gap-x-2">
            {/* <span className="text-yellow-500">{"\u2B50"}</span> */}
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

      {/* Checkbox */}
      {/* <td className="p-2 text-center"> */}
      {/* <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => setIsSelected(!!checked)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
            isSelected
              ? "border-green-500 data-[state=checked]:bg-[#00BA85] data-[state=checked]:text-white"
              : "bg-gray-100"
          }`}
        /> */}
      {/* <Trash2 className="text-gray-400" /> */}
      {/* </td> */}

      {/* More Icon */}
      {/* <td className="p-2">
        {More && (
          <div className="flex items-center justify-center">
            <Image alt="More" src={More} className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
      </td> */}
      {/* <td>
        {callStatus.isInitiated === false
          ? "..."
          : activeCallIndex === index && !isAppointmentBooked
          ? "\uD83D\uDCDE Calling..." // 📞
          : activeCallIndex === index && isAppointmentBooked
          ? "\u2705" // ✅
          : activeCallIndex < index
          ? "..."
          : "\u274C"}
      </td> */}
      {/* Delete Button */}
      <td className="p-2 text-center">
        <button
          onClick={() => setOpen(true)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" />
        </button>
      </td>
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
    </tr>
  );
};
