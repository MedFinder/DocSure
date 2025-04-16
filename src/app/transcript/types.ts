import { CallStatusType } from "../../components/older-pages/search/features/column";

type OpeningHours = {
  status: string;
  time_info: string;
};
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
  opening_hours: OpeningHours;
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
