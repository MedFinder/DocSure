import { CallStatusType } from "../search/features/column";

export interface Doctor {
    id: string;
    name: string;
    title: string;
    image: string;
    isSponsored?: boolean;
    rating: number;
    reviews: number;
    distance: string;
    address: string;
    status: "available" | "calling" | "queue" | "unavailable";
    waitTime: string;
    appointments: string;
  }
  
  export interface LocationInfoProps {
    rating: number;
    reviews: number;
    distance: string;
    address: string;
    waitTime: string;
    appointments: string;
  }
  
  export interface StatusBadgeProps {
    status: Doctor["status"];
    onSkip?: () => void;
    index: number;
    activeCallIndex: number;
    isAppointmentBooked: boolean;
    callStatus: CallStatusType;
  }