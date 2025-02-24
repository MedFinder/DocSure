import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  id: string;
  title: string;
  rating?: number;
  website: string;
  distance?: string;
  index: number;
  activeCallIndex: number;
  isAppointmentBooked: boolean;
  callStatus: {
    isInitiated: boolean;
  };
}
export const Task: React.FC<TaskProps> = ({
  id,
  title,
  rating,
  index,
  activeCallIndex,
  distance,
  website,
  isAppointmentBooked,
  callStatus,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>{index + 1}</td>
      <td>
        <a
          href={website}
          target="_blank"
          className="underline cursor-pointer hover:text-blue-800"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag interference
          }}
        >
          {title}
        </a>
      </td>
      <td>{rating !== undefined ? `\u2B50 ${rating}` : `\u2B50 -`}</td>
      <td>
        {callStatus.isInitiated === false
          ? "..."
          : activeCallIndex === index && !isAppointmentBooked
          ? "\uD83D\uDCDE Calling..." // Unicode for 📞
          : activeCallIndex === index && isAppointmentBooked
          ? "\u2705" // Unicode for ✅
          : activeCallIndex < index
          ? "..."
          : "\u274C"}
      </td>
      <td>{distance}</td>
    </tr>
  );
};
