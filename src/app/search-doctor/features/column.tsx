//@ts-nocheck
import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./column.css";
import { Task, TaskList } from "./tasks";
interface TaskType {
  id: number;
  place_id: number;
  name: string;
  rating?: number;
  website: string;
  distance?: string;
}
export interface CallStatusType {
  isInitiated: boolean;
  ssid: string;
  email: string;
}
interface ColumnProps {
  tasks: TaskType[];
  activeCallIndex: number;
  isAppointmentBooked: boolean;
  transcriptSummary: { place_id: ""; summary: "" };
  transcriptLoading: boolean;
  fromTranscript?: boolean;
  wsRef: React.RefObject<WebSocket | null>;
  reconnectWebSocket: Promise<void>;
  setTranscriptSummary: ({ place_id: string, summary: string }) => void;
  setTranscriptLoading: (loading: boolean) => void;
  callStatus: CallStatusType;
  onDelete: (id: string) => void;
  onSkip?: () => void;
  handleFormSubmit: any;
  isLoading?: boolean;
  topReviewDoctors?: string[];
  handleRemoveDoctor?: (index: string) => void; // Added for "Remove" functionality
  onCallNext?: (index: number) => void; // Added for "Call next" functionality
  topRatedDoctors?: string[]; // Add this new prop
}
const Column: React.FC<ColumnProps> = ({
  tasks,
  activeCallIndex,
  callStatus,
  isAppointmentBooked,
  transcriptSummary,
  detailsSummary,
  transcriptLoading,
  wsRef,
  reconnectWebSocket,
  setTranscriptSummary,
  setDetailsSummary,
  setTranscriptLoading,
  onDelete,
  fromTranscript,
  onSkip,
  onCallNext,
  handleRemoveDoctor,
  handleFormSubmit,
  isLoading,
  topReviewDoctors,
  topRatedDoctors, // Add to function params
}) => {
  return (
    <div className="w-full">
      <table className="task-table w-full border-collapse md:table ">
        <tbody className="block md:table-row-group">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            <TaskList>
              {tasks.map((task, index) => {
                const doctorType = task.types?.[0]
                  ? task.types[0].charAt(0).toUpperCase() +
                    task.types[0].slice(1)
                  : "";
                return (
                  <Task
                    key={index}
                    id={task.id.toString()}
                    place_id={task.place_id}
                    index={index}
                    website={task.website === "NA" ? null : task.website}
                    title={task.name}
                    rating={task.rating}
                    distance={task.distance}
                    activeCallIndex={activeCallIndex}
                    isAppointmentBooked={isAppointmentBooked}
                    callStatus={callStatus}
                    openingStatus={task.opening_hours.status}
                    openingTimeInfo={task.opening_hours.time_info}
                    review={task.user_ratings_total}
                    vicinity={task.formatted_address}
                    address={task.formatted_address}
                    doctorType={doctorType}
                    onDelete={onDelete}
                    transcriptSummary={transcriptSummary}
                    setTranscriptSummary={setTranscriptSummary}
                    transcriptLoading={transcriptLoading}
                    setTranscriptLoading={setTranscriptLoading}
                    wsRef={wsRef}
                    reconnectWebSocket={reconnectWebSocket}
                    fromTranscript={fromTranscript}
                    onSkip={onSkip}
                    onCallNext={onCallNext}
                    handleRemoveDoctor={handleRemoveDoctor}
                    handleFormSubmit={handleFormSubmit}
                    topReviewDoctors={topReviewDoctors}
                    topRatedDoctors={topRatedDoctors} // Pass the new prop
                    isLoading={isLoading}
                  />
                );
              })}
            </TaskList>
          </SortableContext>
        </tbody>
      </table>
    </div>
  );
};
export default Column;
