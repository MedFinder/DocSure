//@ts-nocheck
"use client";
import React, { useEffect, useRef } from "react";
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
  {
    name: "Sarah Connor",
    comment: "I booked a pediatrician for my daughter in minutes. Way easier than calling around.",
  },
  {
    name: "Sarah Connor",
    comment: "Amazing tool for busy people. I handled my appointment during a lunch break—no stress at all.",
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
    name: "Liam Martinez",
    comment:
      "The AI called multiple clinics until it found one—felt like having a personal assistant.",
  },
  {
    index: 2,
    name: "Sophia Carter",
    comment:
      "Booked an urgent care appointment without waiting on hold. Docsure is now my go-to.",
  },
  {
    index: 3,
    name: "Michael Johnson",
    comment:
      "I got an appointment faster through Docsure than by calling the clinic myself. Highly recommend!",
  },
  {
    index: 4,
    name: "Emma Davis",
    comment:
      "Was skeptical at first, but it actually worked! Found a slot the same day.",
  },
  {
    index: 5,
    name: "Sarah Connor",
    comment: "It’s like having a healthcare concierge. Fast, accurate, and no awkward phone calls.",
  },
  {
    index: 6,
    name: "Sarah Connor",
    comment: "Thought it was too good to be true—but it actually works! Booked my appointment instantly.",
  },
  {
    index: 7,
    name: "Sarah Connor",
    comment: "No more calling five clinics to find one opening—Docsure does the heavy lifting for you.",
  },
];

const TestimonialCard = ({ name, comment }) => (
  <article className="px-6 py-8 bg-[#FCF8F2] rounded-lg  w-[320px] h-[218px] flex-shrink-0 flex flex-col">
    {/* Apostrophe Image */}
    <div className="relative w-8 h-8 mb-2">
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
  </article>
);

const TestimonialCarousel = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

  return (
    <div className="w-full overflow-hidden py-6">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
      >
        {testimony.map((testimonial, index) => (
          <div key={index} className="relative flex-shrink-0 w-[320px] h-[450px]">
            <div className="absolute top-0 left-0">
              <TestimonialCard {...testimonial} />
            </div>
            <div className="absolute bottom-0 left-0 ml-10">
              <TestimonialCard {...testimony2[index]} />
            </div>
          </div>
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

export default TestimonialCarousel;
