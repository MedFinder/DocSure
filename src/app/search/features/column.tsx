//@ts-nocheck
import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./column.css";
import { Task } from "./tasks";
interface TaskType {
  id: number;
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
  callStatus: CallStatusType;
}
const Column: React.FC<ColumnProps> = ({
  tasks,
  activeCallIndex,
  callStatus,
  isAppointmentBooked,
}) => {
  return (
    <div className="column">
      <table className="task-table">
        {/* <thead>
          <tr>
            <th>#</th>
            <th>Hospital / Doctor Name</th>
            <th>Rating</th>
            <th>Call Status</th>
            <th>Distance</th>
          </tr>
        </thead> */}
        <tbody>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                id={task.id.toString()}
                index={index}
                website={task.website}
                title={task.name}
                rating={task.rating}
                distance={task.distance}
                activeCallIndex={activeCallIndex}
                isAppointmentBooked={isAppointmentBooked}
                callStatus={callStatus}
                review={task.review}
                address={task.address}
                doctorType={task.doctorType}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
    </div>
  );
};
export default Column;
