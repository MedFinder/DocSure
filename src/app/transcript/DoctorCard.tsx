import React from "react";
import { Doctor } from "./types";
import { LocationInfo } from "./LocationInfo";
import { StatusBadge } from "./StatusBadge";
import { CallStatusType } from "../search/features/column";

interface DoctorCardProps {
  doctor: Doctor;
  onSkip?: () => void;
  index: number;
  activeCallIndex: number;
  isAppointmentBooked: boolean;
  callStatus: CallStatusType;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor,index, onSkip, activeCallIndex, isAppointmentBooked, callStatus  }) => {
 const getRandomColor = (id: string) => {
    const colors = ["#FFD700", "#FF6347", "#4682B4", "#32CD32", "#FF69B4"];
    const numericId = id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[numericId % colors.length];
  };
  return (
    <article className="flex flex-col w-full mb-6 last:mb-0">
      <div className="flex gap-5 justify-between items-start mr-3 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-3 text-black">
        <div
          className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12"
          style={{ backgroundColor: getRandomColor(doctor.id) }}
        >
          {doctor?.name.charAt(0)}
        </div>
          <div className="flex flex-col self-start max-w-[60%]">
            {doctor.isSponsored && (
              <span className="text-xs tracking-tight">Sponsored</span>
            )}
            <h3 className="text-base font-medium tracking-tight">
              {doctor.name}
            </h3>
            <p className="text-xs tracking-tight">{doctor.title}</p>
          </div>
        </div>

        <div className="flex justify-between items-center w-full sm:w-auto max-md:max-w-full">
          <div className="flex-1">
            <LocationInfo
              rating={doctor.rating}
              reviews={doctor.reviews}
              distance={doctor.distance}
              address={doctor.address}
              waitTime={doctor.waitTime}
              appointments={doctor.appointments}
            />
          </div>
          <div className="ml-auto w-[190px] min-w-[190px] flex justify-end items-center h-full">
            <StatusBadge status={doctor.status} index={index} onSkip={onSkip} activeCallIndex={activeCallIndex} callStatus={callStatus} isAppointmentBooked={isAppointmentBooked} />
          </div>
        </div>
      </div>
      <div className="shrink-0 mt-6 h-px border border-solid border-black border-opacity-10" />
    </article>
  );
};
