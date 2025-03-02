//@ts-nocheck
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin } from "lucide-react";
import Image from "next/image";
import More from "../../../../public/more.png";

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
}

const getRandomColor = (id: string) => {
  const colors = ["#FFD700", "#FF6347", "#4682B4", "#32CD32", "#FF69B4"];
  const numericId = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[numericId % colors.length];
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
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isSelected, setIsSelected] = useState(true);

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
        isSelected ? "bg-blue-50" : "bg-white"
      }`}
    >
      {/* Avatar with Dynamic Background Color */}
      <td className="p-2 text-center">
        <div
          className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12"
          style={{ backgroundColor: getRandomColor(id) }}
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
            <span className="text-yellow-500">{"\u2B50"}</span>
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
      <td className="p-2 text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => setIsSelected(!!checked)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
            isSelected
              ? "border-green-500 data-[state=checked]:bg-[#00BA85] data-[state=checked]:text-white"
              : "bg-gray-100"
          }`}
        />
      </td>

      {/* More Icon */}
      <td className="p-2">
        <Image alt="more" src={More} className="h-4 w-3 sm:h-5 sm:w-4" />
      </td>
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
    </tr>
  );
};
