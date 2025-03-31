//@ts-nocheck
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

const testimony = [
  {
    name: "Eric Wiser",
    comment:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    name: "Sophia Carter",
    comment:
      "Amazing experience! The process was seamless, and the team was super helpful. Highly recommend!",
  },
  {
    name: "Michael Johnson",
    comment:
      "Great service! Everything was handled professionally, and I felt valued as a customer.",
  },
  {
    name: "Emma Davis",
    comment:
      "The quality of service exceeded my expectations. Will definitely come back!",
  },
  {
    name: "Liam Martinez",
    comment:
      "Fast, reliable, and excellent communication throughout. Highly satisfied!",
  },
  {
    name: "Sarah Connor",
    comment:
      "I have never seen such an efficient service. Everything was taken care of from start to finish without any issues!",
  },
];

const TestimonialCard = ({ name, comment }) => (
  <article className="box-border px-6 py-6 bg-white rounded-lg w-80 h-56 flex-shrink-0 shadow-md flex flex-col ">
    {/* Apostrophe Image */}
    <div className="relative w-8 h-8 mb-2 ">
      <Image
        src="/apostrophe.svg"
        alt="Apostrophe Icon"
        layout="fill"
        objectFit="contain"
      />
    </div>

    {/* Truncated Testimonial Text */}
    <p className="text-sm text-gray-700 mb-4 line-clamp-3 pt-2 overflow-hidden">
      {comment}
    </p>

    {/* Name */}
    <span className="text-sm font-semibold text-gray-900 pt-6">{name}</span>
  </article>
);
const TestimonialCardB = ({ name, comment }) => (
  <article className="box-border px-6 py-6 bg-white rounded-lg w-80 h-56 flex-shrink-0 shadow-md md:flex flex-col hidden ">
    {/* Apostrophe Image */}
    <div className="relative w-8 h-8 mb-2 ">
      <Image
        src="/apostrophe.svg"
        alt="Apostrophe Icon"
        layout="fill"
        objectFit="contain"
      />
    </div>

    {/* Truncated Testimonial Text */}
    <p className="text-sm text-gray-700 mb-4 line-clamp-3 pt-2 overflow-hidden">
      {comment}
    </p>

    {/* Name */}
    <span className="text-sm font-semibold text-gray-900 pt-6">{name}</span>
  </article>
);

const TestimonialCarousel = () => {
  return (
    <div className="w-full overflow-hidden py-6">
      <Swiper
        slidesPerView={5} // Default for large screens
        spaceBetween={20}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        modules={[Autoplay, Pagination]}
        className="w-full"
        grid={{
          rows: 2,
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 5 }, // Mobile
          640: { slidesPerView: 2, spaceBetween: 10 }, // Tablets
          1024: { slidesPerView: 3, spaceBetween: 15 }, // Medium Screens
          1280: { slidesPerView: 5, spaceBetween: 200 }, // Larger Screens
        }}
      >
        {testimony.map((testimonial, index) => (
          <SwiperSlide key={index} className="">
            <div className="flex flex-col gap-4">
              <TestimonialCard {...testimonial} />
              <TestimonialCardB {...testimonial} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots Centered for Mobile & Tablet */}
      <div className="swiper-pagination mt-6 flex justify-center md:hidden"></div>

      {/* Global Styles for Pagination Dots */}
      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination-bullet {
          background: #ffff !important;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          // opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          background: #b32d1b !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TestimonialCarousel;
