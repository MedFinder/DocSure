//@ts-nocheck

"use client";

import React from "react";
import DoctorCardCarousel from "./DoctorCardCarousel";

const DoctorCardExample: React.FC = () => {
  return (
    <div className="p-4">
      <DoctorCardCarousel
        initial="D"
        name="Dr. Dhruv Markan, MD"
        address="317 E 34th St - 317 E 34th St, New York, NY 10016"
        rating={4.52}
        distance="2.7 mi"
        availabilityLink="#"
      />
    </div>
  );
};

export default DoctorCardExample;
