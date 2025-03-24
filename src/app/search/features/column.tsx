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
  onDelete: (id: string) => void;
}
const Column: React.FC<ColumnProps> = ({
  tasks,
  activeCallIndex,
  callStatus,
  isAppointmentBooked,
  onDelete,
}) => {
  // Function to delete a task by ID

  // return (
  //   <div className="column">
  //     <table className="task-table">
  //       {/* <thead>
  //         <tr>
  //           <th>#</th>
  //           <th>Hospital / Doctor Name</th>
  //           <th>Rating</th>
  //           <th>Call Status</th>
  //           <th>Distance</th>
  //         </tr>
  //       </thead> */}
  //       <tbody>
  //         <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
  //           {tasks.map((task, index) => {
  //             const doctorType = task.types?.[0]
  //               ? task.types[0].charAt(0).toUpperCase() + task.types[0].slice(1)
  //               : "";

  //               return (
  //               <Task
  //                 key={task.id}
  //                 id={task.id.toString()}
  //                 index={index}
  //                 website={task.website === 'NA' ? null : task.website}
  //                 title={task.name}
  //                 rating={task.rating}
  //                 distance={task.distance}
  //                 activeCallIndex={activeCallIndex}
  //                 isAppointmentBooked={isAppointmentBooked}
  //                 callStatus={callStatus}
  //                 review={task.user_ratings_total}
  //                 vicinity={task.vicinity}
  //                 address={task.address}
  //                 doctorType={doctorType}
  //                 onDelete={onDelete}
  //               />
  //               );
  //           })}
  //         </SortableContext>
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="w-full">
      <table className="task-table w-full border-collapse md:table">
        <tbody className="block md:table-row-group">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            <TaskList>
              {tasks.map((task, index) => {
                const doctorType = task.types?.[0]
                  ? task.types[0].charAt(0).toUpperCase() + task.types[0].slice(1)
                  : "";
                return (
                  <Task
                    key={task.id}
                    id={task.id.toString()}
                    index={index}
                    website={task.website === "NA" ? null : task.website}
                    title={task.name}
                    rating={task.rating}
                    distance={task.distance}
                    activeCallIndex={activeCallIndex}
                    isAppointmentBooked={isAppointmentBooked}
                    callStatus={callStatus}
                    review={task.user_ratings_total}
                    vicinity={task.formatted_address}
                    address={task.formatted_address}
                    doctorType={doctorType}
                    onDelete={onDelete}
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
