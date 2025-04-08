/* eslint-disable @next/next/no-img-element */
import React from "react";
import { StatusBadgeProps } from "./types";

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status: initialStatus,
  index,
  activeCallIndex,
  isAppointmentBooked,
  callStatus,
  onSkip 
}) => {
  // Determine the actual status to display based on conditions
  const status = (() => {
    // If this doctor is the active one being called and appointment isn't booked yet
    if (index === activeCallIndex && !isAppointmentBooked && callStatus.isInitiated) {
      return "calling";
    }
    // If this doctor is the active one and appointment is booked
    else if (index === activeCallIndex && isAppointmentBooked) {
      return "available";
    }

      // If this doctor is the active one and appointment is booked
      else if (activeCallIndex > index && !isAppointmentBooked) {
        return "unavailable";
      }
    // Otherwise use the provided status or default to "queue"
    else {
      return initialStatus || "queue";
    }
  })();

  const getStatusContent = () => {
    switch (status) {
      case "calling":
        return (
          <div className="flex gap-6 justify-end items-center text-xs tracking-tight text-center">
            <div className="flex gap-1 justify-center items-center px-7 py-2 text-xs tracking-tight text-center text-white whitespace-nowrap bg-emerald-500 rounded max-md:px-5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/8301652374e6d52a89e6e48d92ff032396ae12c7b5fc85e35d91f5f40c73e7b8?placeholderIfAbsent=true"
                className="object-contain shrink-0 self-stretch my-auto w-3.5 rounded-none aspect-square"
                alt=""
              />
              <span className="self-stretch my-auto">Calling...</span>
            </div>
            <button
              onClick={onSkip}
              className="my-auto underline text-zinc-800"
            >
              Skip
            </button>
          </div>
        );
      case "queue":
        return (
          <div className="flex gap-6 justify-end items-center text-xs tracking-tight text-center">
            <span className="gap-1 px-3.5 py-2 text-orange-500 bg-orange-50 rounded">
              In Queue
            </span>
          </div>
        );
      case "available":
        return (
          <div className="flex gap-6 justify-end items-center text-xs tracking-tight text-center">
            <span className="gap-1 px-3.5 py-2 text-green-600 bg-green-50 rounded">
              Appointment Booked
            </span>
          </div>
        );
      case "unavailable":
        return (
          <span className="gap-2.5 p-2 text-xs tracking-tight text-center rounded bg-zinc-100 text-neutral-500">
            No Appointments Available
          </span>
        );
      default:
        return (
          <div className="flex gap-6 justify-end items-center text-xs tracking-tight text-center">
            <span className="gap-1 px-3.5 py-2 text-orange-500 bg-orange-50 rounded">
              In Queue
            </span>
          </div>
        );
    }
  };

  return <div className="flex items-center justify-end w-full">{getStatusContent()}</div>;
};
