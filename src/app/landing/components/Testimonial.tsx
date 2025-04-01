//@ts-nocheck
"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Virtual } from "swiper/modules";
import Image from "next/image";

const testimony = [
  {
    name: "Eric Wiser",
    comment:
      "Docsure saved me hours! It found an appointment when every clinic said they were full.",
  },
  {
    name: "Sophia Carter",
    comment:
      "Finally got my mom an appointment without endless calling. Docsure did it in minutes—so grateful!",
  },
  {
    name: "Michael Johnson",
    comment:
      "I hate making calls—Docsure just did it all. Absolutely genius and super reliable.",
  },
  {
    name: "Emma Davis",
    comment:
      "Game changer. I don’t have to sit on hold anymore. Got my appointment while working.",
  },
  {
    name: "Liam Martinez",
    comment:
      "Docsure feels like magic. I put in the request, and boom—confirmed appointment texted to me.",
  },
  {
    name: "Sarah Connor",
    comment: "Love it! Even helped me find a doctor who accepts my insurance. No back-and-forth.",
  },
];
const testimony2 = [
  {
    index: 0,
    name: "Eric Wiser",
    comment:
      "Docsure took all the stress out of booking appointments for my kids. Every parent needs this!",
  },
  {
    index: 1,
    name: "Sophia Carter",
    comment:
      "Booked an urgent care appointment without waiting on hold. Docsure is now my go-to.",
  },
  {
    index: 2,
    name: "Michael Johnson",
    comment:
      "I got an appointment faster through Docsure than by calling the clinic myself. Highly recommend!",
  },
  {
    index: 3,
    name: "Emma Davis",
    comment:
      "Was skeptical at first, but it actually worked! Found a slot the same day.",
  },
  {
    index: 4,
    name: "Liam Martinez",
    comment:
      "Docsure saved me hours! It found an appointment when every clinic said they were full.",
  },
  {
    index: 5,
    name: "Sarah Connor",
    comment: "Finally got my mom an appointment without endless calling. Docsure did it in minutes—so grateful!",
  },
];

const TestimonialCard = ({ name, comment }) => (
  <article className="px-6 py-12 bg-[#FCF8F2] rounded-lg md:w-[405px] md:h-[204px] w-[381px] h-[248px]  flex-shrink-0 flex flex-col">
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
    <p className="text-sm text-gray-700 mb-4 line-clamp-3 pt-4 overflow-hidden">
      {comment}
    </p>

    {/* Name */}
    {/* <span className="text-sm font-semibold text-gray-900 ">{name}</span> */}
  </article>
);

const TestimonialCardB = ({ index, name, comment }) => {
  return (
    <article className="px-6 py-12 bg-[#FCF8F2] rounded-lg md:w-[405px] md:h-[204px] w-[381px] h-[248px]  flex-shrink-0 flex flex-col">
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
      <p className="text-sm text-gray-700 mb-4 line-clamp-3 pt-4 overflow-hidden">
        {comment}
      </p>

      {/* Name */}
      {/* <span className="text-sm font-semibold text-gray-900 ">{name}</span> */}
    </article>
  );
};

const TestimonialCarousel = () => {
  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <div className="w-full overflow-hidden py-6">
      <Swiper
        onSwiper={setSwiperRef} // Capture Swiper instance
        slidesPerView={4} // Default for large screens
        spaceBetween={60}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        modules={[Autoplay, Pagination, Virtual]}
        virtual
        grid={{
          rows: 2, // Grid layout with 2 rows
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 5 }, // Mobile
          480: { slidesPerView: 1, spaceBetween: 5 },
          640: { slidesPerView: 2, spaceBetween: 10 }, // Tablets
          1024: { slidesPerView: 3, spaceBetween: 15 }, // Medium Screens
          1280: { slidesPerView: 4.2, spaceBetween: 30 }, // Larger Screens
        }}
      >
        {testimony.map((testimonial, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            <div className="flex flex-col gap-4">
              <TestimonialCard {...testimonial} />
              <TestimonialCardB {...testimony2[index]} />
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
