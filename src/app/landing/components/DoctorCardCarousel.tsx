//@ts-nocheck
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import StarRating from "./StarRating";
import LocationPin from "./LocationPin";

const doctors = [
  {
    initial: "A",
    name: "Dr. Alice Smith, MD",
    address: "New York, NY",
    rating: 4.8,
    distance: "1.2 mi",
    color: "bg-yellow-300",
  },
  {
    initial: "B",
    name: "Dr. Brian Jones, DO",
    address: "Los Angeles, CA",
    rating: 4.7,
    distance: "3.5 mi",
    color: "bg-blue-300",
  },
  {
    initial: "C",
    name: "Dr. Chloe Kim, DDS",
    address: "Chicago, IL",
    rating: 4.6,
    distance: "2.1 mi",
    color: "bg-pink-300",
  },
  {
    initial: "D",
    name: "Dr. Daniel Lee, MD",
    address: "Houston, TX",
    rating: 4.9,
    distance: "4.3 mi",
    color: "bg-yellow-300",
  },
  {
    initial: "E",
    name: "Dr. Emma Patel, DO",
    address: "Miami, FL",
    rating: 4.5,
    distance: "2.9 mi",
    color: "bg-blue-300",
  },
  {
    initial: "F",
    name: "Dr. Frank Carter, MD",
    address: "Seattle, WA",
    rating: 4.3,
    distance: "5.2 mi",
    color: "bg-pink-300",
  },
  {
    initial: "G",
    name: "Dr. Grace Wilson, DDS",
    address: "Boston, MA",
    rating: 4.4,
    distance: "1.8 mi",
    color: "bg-yellow-300",
  },
  {
    initial: "H",
    name: "Dr. Henry Adams, MD",
    address: "Denver, CO",
    rating: 4.7,
    distance: "3.1 mi",
    color: "bg-blue-300",
  },
];

const DoctorInfoCard = ({
  initial,
  name,
  address,
  rating,
  distance,
  color,
}) => (
  <article className="box-border px-6 py-5 bg-white rounded-lg w-60 h-[220px] flex-shrink-0">
    <div className="flex flex-col items-center text-center">
      <div
        className={`mb-2.5 text-lg font-semibold ${color} rounded-full h-[50px] text-black w-[50px] flex items-center justify-center`}
      >
        {initial}
      </div>
      <h2 className="mb-1.5 text-base font-medium text-black">{name}</h2>
      <address className="mb-1.5 text-xs leading-5 text-zinc-800 not-italic">
        {address}
      </address>
      <div className="flex gap-2 justify-center items-center mb-3">
        <StarRating rating={rating} />
        <div className="flex gap-1 items-center text-xs text-zinc-800">
          <LocationPin />
          <span>{distance}</span>
        </div>
      </div>
      <a href="#" className="text-xs text-[#E5573F] underline">
        Check Availability &gt;
      </a>
    </div>
  </article>
);

const DoctorCardCarousel = () => {
  return (
    <div className="w-full overflow-hidden h-60">
      <Swiper
        slidesPerView={6} // Default for large screens
        spaceBetween={150}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        modules={[Autoplay, Pagination]}
        className="w-full"
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 5 }, // Show 1.5 cards on mobile
          640: { slidesPerView: 2, spaceBetween: 10 }, // Tablets
          1024: { slidesPerView: 6, spaceBetween: 150 }, // Desktop
        }}
      >
        {doctors.map((doc, index) => (
          <SwiperSlide key={index}>
            <DoctorInfoCard {...doc} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots Centered for Mobile & Tablet */}
      <div className="swiper-pagination mt-8 flex justify-center md:hidden px-36"></div>

      {/* Global Styles for Pagination Dots */}
      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination-bullet {
          background: #e5573f !important;
          width: 8px;
          height: 8px;
          margin: 0 4px; /* Reduced spacing */
        }
        .swiper-pagination-bullet-active {
          background: #b32d1b !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default DoctorCardCarousel;
