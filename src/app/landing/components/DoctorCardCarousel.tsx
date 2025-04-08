//@ts-nocheck
"use client";
import React, { useRef, useEffect } from "react";
import StarRating from "./StarRating";
import LocationPin from "./LocationPin";
import dynamic from "next/dynamic";

const LoadingSumamry = dynamic(
  () => import("../../../components/Loading/LoadingSummary"),
  {
    ssr: false, // Disable SSR for this component
  }
);
const DoctorInfoCard = ({
  initial,
  name,
  address,
  rating,
  distance,
  color,
  checkPrefillAvailability, // Add checkPrefillAvailability prop
}) => (
  <article className="box-border px-6 py-4 bg-white rounded-lg w-[238px] h-[244px] flex-shrink-0">
    <div className="flex flex-col items-center text-center justify-center">
      <div
        className={`mb-2.5 text-lg font-semibold ${color} rounded-full h-[50px] text-black w-[50px] flex items-center justify-center`}
      >
        {initial}
      </div>
      <h2
        className="mb-1.5 text-base font-medium text-black line-clamp-1"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: 1,
        }}
      >
        {name}
      </h2>
      <address
        className="mb-1.5 text-xs leading-5 text-zinc-800 not-italic line-clamp-2"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: 2,
        }}
      >
        {address}
      </address>
      <div className="flex gap-2 justify-center items-center mb-3">
        <StarRating rating={rating} />
        <div className="flex gap-1 items-center text-xs text-zinc-800">
          <LocationPin />
          <span>{distance}</span>
        </div>
      </div>
      <a
        className="text-xs text-[#E5573F] underline"
        onClick={() => checkPrefillAvailability && checkPrefillAvailability(name)} // Use the function
      >
        Check Availability &gt;
      </a>
    </div>
  </article>
);

const getRandomColor = () => {
  const colors = ["bg-yellow-300", "bg-blue-300", "bg-pink-300"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const DoctorCardCarousel = ({ doctors, checkPrefillAvailability }) => { // Accept checkPrefillAvailability as a prop
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const scrollMarquee = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft >= maxScrollLeft) {
          cancelAnimationFrame(animationFrameId); // Stop scrolling
          scrollContainerRef.current.scrollLeft = -200; // Scroll back to the beginning
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(scrollMarquee); // Restart marquee
          }, 2000);
        } else {
          scrollContainerRef.current.scrollLeft += 1; // Adjust speed by changing the increment
          animationFrameId = requestAnimationFrame(scrollMarquee);
        }
      }
    };

    animationFrameId = requestAnimationFrame(scrollMarquee);

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, []);

  if (!doctors || doctors.length === 0) {
    // Add null/undefined check for doctors
    return (
      <div className="flex items-center justify-center h-60">
        <LoadingSumamry customstyle={{ height: "200px", width: "200px" }} />{" "}
        {/* Pass custom style props */}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden h-60 py-6 pl-4">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-scroll scrollbar-hide"
      >
        {doctors.map((doc, index) => (
          <DoctorInfoCard
            key={index}
            initial={doc.name?.charAt(0) || "D"}
            name={doc.name || "Unknown Doctor"}
            address={doc.formatted_address || "Unknown Address"}
            rating={doc.rating || 0}
            distance={doc.distance || "N/A"}
            color={getRandomColor()}
            checkPrefillAvailability={checkPrefillAvailability} // Pass the function to DoctorInfoCard
          />
        ))}
      </div>

      {/* Global Styles for Custom Scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
    </div>
  );
};

export default DoctorCardCarousel;
