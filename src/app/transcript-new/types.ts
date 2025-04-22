import { CallStatusType } from "../../components/older-pages/search/features/column";

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
  onCallNext?: (index: number) => void; // Added callback for "Call next" functionality
  index: number;
  activeCallIndex: number;
  isAppointmentBooked: boolean;
  callStatus: CallStatusType;
}
