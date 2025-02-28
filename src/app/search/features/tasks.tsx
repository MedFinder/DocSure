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

  // Convert string ID into a consistent numeric value
  const numericId = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[numericId % colors.length]; // ✅ Now it works!
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
  const [isSelected, setIsSelected] = useState(true); // Checkbox is checked on load

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
      {/* Avatar with Random Background Color */}
      <td className="avatar-cell">
        <div
          className="avatar rounded-full text-white flex items-center justify-center font-bold"
          style={{ backgroundColor: getRandomColor(id), width: 50, height: 50 }}
        >
          {title.charAt(0)}
        </div>
      </td>

      {/* Doctor Info */}
      <td>
        <div className="flex flex-col">
          <a
            href={website}
            target="_blank"
            className="cursor-pointer font-semibold"
            onClick={(e) => e.stopPropagation()} // Prevent drag interference
          >
            {title}
          </a>
          <span className="text-sm">{doctorType}</span>
        </div>
      </td>

      {/* Ratings & Location */}
      <td className="text-sm">
        <div className="flex flex-col text-[#333333]">
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-yellow-500">{"\u2B50"}</span>
            <span>{rating !== undefined ? rating : "-"}</span>
            <span>•</span>
            <span>{review || 0} reviews</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-2 text-sm text-[#333333]">
          <MapPin size={13} className="text-gray-500" />
          <span>{distance !== undefined ? distance : "-"}</span>
          <span>•</span>
          <span>{vicinity}</span>
        </div>
        {/* <div className="flex flex-row items-center gap-x-2 text-sm text-[#a1a1a1]">
          <span>New patient appointments</span>
          <span>•</span>
          <span>Excellent wait time</span>
        </div> */}
      </td>

      {/* Checkbox with Dynamic Colors */}
      <td>
        <div className="flex justify-center items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => setIsSelected(!!checked)} // Toggle state properly
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-5 h-5 rounded-full transition-all duration-300  ${
              isSelected
                ? "0 border-green-500 data-[state=checked]:bg-[#00BA85] data-[state=checked]:text-white"
                : "bg-gray-100"
            }`}
          />
        </div>
      </td>
      <td>
        <Image alt="more" src={More} className=" h-4 w-3 "></Image>
      </td>
      {/* Call Status */}
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
