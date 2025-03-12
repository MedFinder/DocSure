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

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  index,
  onSkip,
  activeCallIndex,
  isAppointmentBooked,
  callStatus,
}) => {
  const getAlternateColor = (index: number) => {
    const colors = ["#F7D07D", "#A0F1C2"]; // Gold & Light Green
    return colors[index % 2]; // Alternate based on index
  };

  return (
    <>
      {/* Web View (Existing Layout) */}
      <article className="hidden md:flex flex-col w-full mb-6 last:mb-0">
        <div className="flex gap-5 justify-between items-start mr-3 max-md:mr-2.5 max-md:max-w-full">
          <div className="flex gap-3 text-black">
            <div
              className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12"
              style={{ backgroundColor: getAlternateColor(index) }}
            >
              {doctor?.name.charAt(0)}
            </div>
            <div className="flex flex-col self-start max-w-[60%] ">
              {doctor.isSponsored && (
                <span className="text-xs tracking-tight">Sponsored</span>
              )}
              <h3 className="text-base font-medium tracking-tight">
                {doctor.name}
              </h3>
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
              <StatusBadge
                status={doctor.status}
                index={index}
                onSkip={onSkip}
                activeCallIndex={activeCallIndex}
                callStatus={callStatus}
                isAppointmentBooked={isAppointmentBooked}
              />
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-6 h-px border border-solid border-black border-opacity-10" />
      </article>

      {/* Mobile View (New Card Design) */}
      <article className="flex md:hidden flex-col w-full  bg-white shadow-md border-b-2 border-gray-200 ">
        {/* Top Section: Avatar + Name in a Card Style */}
        <div className="flex gap-4 py-2">
          <div
            className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12"
            style={{ backgroundColor: getAlternateColor(index) }}
          >
            {doctor?.name.charAt(0)}
          </div>
          <div className="flex flex-col ">
            <h3 className="text-lg font-semibold mt-2">{doctor.name}</h3>
            {doctor.isSponsored && (
              <span className="text-xs text-gray-500 tracking-tight">
                Sponsored
              </span>
            )}
            <div className=" gap-2 mt-4">
              <LocationInfo
                rating={doctor.rating}
                reviews={doctor.reviews}
                distance={doctor.distance}
                address={doctor.address}
                waitTime={doctor.waitTime}
                appointments={doctor.appointments}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}

        {/* Status Badge */}
        <div className=" my-2 mr-8">
          <StatusBadge
            status={doctor.status}
            index={index}
            onSkip={onSkip}
            activeCallIndex={activeCallIndex}
            callStatus={callStatus}
            isAppointmentBooked={isAppointmentBooked}
          />
        </div>
      </article>
    </>
  );
};
