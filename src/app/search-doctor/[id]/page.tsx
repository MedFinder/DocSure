"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import remarkGfm from "remark-gfm";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const DoctorDetailPage = () => {
  const params = useParams();
  const { place_id } = params;
  const [summaryMarkdown, setSummaryMarkdown] = useState("");
  const [imageMarkdown, setImageMarkdown] = useState([]);

  useEffect(() => {
    console.log("DoctorDetailPage useEffect triggered");

    const storedSummary = localStorage.getItem("doctorDetail");

    if (storedSummary && storedSummary !== "undefined") {
      try {
        const parsed = JSON.parse(storedSummary);
        console.log("Doctor summary from localStorage:", parsed);

        if (parsed?.images && Array.isArray(parsed.images)) {
          setImageMarkdown(parsed.images);
        } else {
          console.warn("No 'images' field found or it's not an array");
        }

        if (parsed?.profile) {
          console.log("Profile markdown:", parsed.profile);
          setSummaryMarkdown(parsed.profile);
        } else {
          console.warn("No 'profile' field found in parsed doctorDetail");
        }
      } catch (err) {
        console.error("Failed to parse doctorDetail:", err);
      }
    } else {
      console.warn("No valid doctor summary found in localStorage");
    }
  }, []);

  console.log(imageMarkdown);
  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/fallback.jpg"; // Place a local fallback image in your public folder
  };

  return (
    <div className="space-y-6 p-4 md:p-8 bg-white rounded-xl shadow-sm md:px-80">
      {imageMarkdown?.length > 0 && (
        <div className="w-full">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="rounded-md overflow-hidden"
          >
            {imageMarkdown.map((src, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={src}
                  alt={`Doctor Image ${idx + 1}`}
                  onError={handleImageError}
                  className="w-full object-cover h-[200px] sm:h-[250px] md:h-[300px] lg:h-[300px] rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose max-w-none"
        components={{
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold border-b pb-1  ">
              {props.children}
            </h2>
          ),
          p: ({ node, ...props }) => (
            <p className="text-sm text-gray-700  pb-4 pt-2">{props.children}</p>
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {props.children}
            </ul>
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm">{props.children}</li>
          ),
          table: ({ node, ...props }) => (
            <table className="w-full text-sm text-left border mt-2">
              {props.children}
            </table>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100 text-gray-600">
              {props.children}
            </thead>
          ),
          th: ({ node, ...props }) => (
            <th className="border px-2 py-1 font-medium">{props.children}</th>
          ),
          td: ({ node, ...props }) => (
            <td className="border px-2 py-1">{props.children}</td>
          ),
        }}
      >
        {summaryMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default DoctorDetailPage;
