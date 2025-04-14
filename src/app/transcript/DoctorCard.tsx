import React from "react";
import { Doctor } from "./types";
import { LocationInfo } from "./LocationInfo";
import { StatusBadge } from "./StatusBadge";
import { CallStatusType } from "../../components/older-pages/search/features/column";

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

  console.log("DoctorCard", doctor);
  return (
    <>
      {/* Web View (Existing Layout) */}
      <article className="hidden md:flex py-2 gap-2 w-full mb-3 last:mb-0">
        <div className="flex md:gap-2 gap-0">
          <div className="flex  md:gap-2 gap-0 items-center">
            <span className="hidden bg-[#0074BA] rounded-full w-8 h-8 my-4 sm:w-6 sm:h-6 text-white md:flex items-center justify-center text-xs sm:text-sm font-medium">
              {index + 1}
            </span>
          </div>
        </div>
        <div className="bg-[#F2F6F9] py-4 md:px-3  px-3 rounded-md flex flex-col gap-4 w-full min-w-[90vw] md:min-w-0 ">
          <div className="flex flex-col gap-2 font-normal w-full">
            <div className="flex justify-between ">
              <div className="flex flex-grow items-start gap-2 md:hidden w-full  ">
                <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
                  {index + 1}
                </span>

                <div className="block w-full  sm:max-w-full whitespace-normal overflow-hidden text-ellipsis cursor-pointer font-medium text-base leading-snug break-words">
                  {doctor.isSponsored && (
                    <span className="text-xs tracking-tight">Sponsored</span>
                  )}
                  <h3 className="text-base font-medium tracking-tight">
                    {doctor.name}
                  </h3>
                </div>
              </div>

              <div className="cursor-pointer font-medium text-base sm:text-base hidden md:block ">
                {doctor.isSponsored && (
                  <span className="text-xs tracking-tight">Sponsored</span>
                )}
                <h3 className="text-base font-medium tracking-tight">
                  {doctor.name}
                </h3>
              </div>
              <div className="flex justify-between items-center w-full sm:w-auto max-md:max-w-full ">
                <div className="">
                  <LocationInfo
                    rating={doctor.rating}
                    reviews={doctor.reviews}
                    distance={doctor.distance}
                    address={doctor.address}
                    waitTime={doctor.waitTime}
                    appointments={doctor.appointments}
                  />
                </div>
                <div className="ml-auto w-[190px] min-w-[190px] flex justify-end items-center h-full ">
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
            <h3 className="text-sm  text-[#636465] tracking-tight">
              {doctor.address}
            </h3>
          </div>
        </div>

        <div className="shrink-0 mt-6 h-px border border-solid border-black border-opacity-10" />
      </article>

      {/* Mobile View (New Card Design) */}
      {/* Mobile View (New Card Design) */}
      <article className="flex md:hidden flex-col w-full bg-white shadow-md">
        {/* Top Section: Avatar + Name in a Card Style */}
        <div className="flex gap-2 py-2">
          {/* <div
            className="rounded-full text-white flex items-center justify-center font-bold w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
            style={{ backgroundColor: getAlternateColor(index) }}
          >
            {doctor?.name.charAt(0)}
          </div> */}
          <div className="flex items-center mr-1">
            <div className="md:flex items-center hidden justify-center mr-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F1fce0463b354425a961fa14453bc1061%2F3ab7f5eb61b64319aa2f2a85994bff66"
                alt="Input design element"
                className="box-border object-contain overflow-hidden shrink-0 w-full aspect-[1.37] max-w-[9px] min-h-3 min-w-3"
              />
            </div>
            <span className="bg-[#0074BA] rounded-full w-4 h-4 text-white flex items-center justify-center text-xs font-medium mt-[2px] shrink-0">
              {index + 1}
            </span>
          </div>
          <div className="flex flex-col flex-grow bg-[#F2F6F9] p-3 rounded-md">
            <h3 className="text-base break-words">{doctor.name}</h3>
            {doctor.isSponsored && (
              <span className="text-xs text-gray-500 tracking-tight">
                Sponsored
              </span>
            )}
            <h3 className="text-sm pt-2  text-[#636465] tracking-tight">
              {doctor.address}
            </h3>
            <div className="gap-2 mt-2">
              <LocationInfo
                rating={doctor.rating}
                reviews={doctor.reviews}
                distance={doctor.distance}
                address={doctor.address}
                waitTime={doctor.waitTime}
                appointments={doctor.appointments}
              />
            </div>
            <div className="mt-2 mr-4 flex self-end">
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

        {/* Info Section */}

        {/* Status Badge */}
      </article>
    </>
  );
};
