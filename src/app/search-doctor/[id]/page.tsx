//@ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import remarkGfm from "remark-gfm";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FooterSection from "@/app/landing/components/FooterSection";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
const DoctorDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [imageMarkdown, setImageMarkdown] = useState([]);
  const [summaryMarkdown, setSummaryMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const parsedHTML = DOMPurify.sanitize(marked.parse(summaryMarkdown || ""));
  useEffect(() => {
    // On mount, get doctorProfilePayload from localStorage
    const doctorProfilePayload = localStorage.getItem("doctorProfilePayload");
    if (doctorProfilePayload) {
      try {
        const parsed = JSON.parse(doctorProfilePayload);
        if (parsed.images && Array.isArray(parsed.images)) {
          setImageMarkdown(parsed.images);
        }
        if (parsed.profile) {
          setSummaryMarkdown(parsed.profile);
        }
      } catch (e) {
        // handle error
      }
    }
  }, []);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/fallback.jpg"; // Place a local fallback image in your public folder
  };

  if (loading) {
    return (
      <div className="flex  flex-col  items-center pt-96 p-10 gap-2 text-center text-gray-500 text-lg justify-center">
        Loading doctor details...
        <Loader2 className="w-10 h-10 text-[#E5573F] animate-spin" />
      </div>
    );
  }

  const doctorCallPayloadFromLocalStorageForRender = JSON.parse(
    localStorage.getItem("doctorCallPayload") || "{}"
  );

  const chunkArray = (arr: any, size: any) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  return (
    <div>
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50 text-sm">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/web-new-logo.svg"
              alt="DocSure Logo"
              width={0}
              height={0}
              className="w-28 h-auto md:flex cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>
      </nav>
      <div className="space-y-6 p-4 md:p-8 mt-14 bg-white rounded-xl shadow-sm md:px-80">
        {imageMarkdown?.length > 0 && (
          <div className="w-full">
            <Swiper
              // modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              // autoplay={{
              //   delay: 3000,
              //   disableOnInteraction: false,
              // }}
              // pagination={{ clickable: true }}
              className="rounded-md overflow-hidden"
            >
              {chunkArray(imageMarkdown, 5).map((group, slideIdx) => (
                <SwiperSlide key={slideIdx}>
                  <div className="grid grid-cols-5 gap-2">
                    {" "}
                    {group.map((src: any, idx: any) => (
                      <img
                        key={idx}
                        src={src.original}
                        width={src.original.width}
                        alt={`Doctor Image ${slideIdx * 4 + idx + 1}`}
                        onError={handleImageError}
                        className="w-full object-cover h-[70px] sm:h-[100px] md:h-[130px] rounded-md" // Reduced heights
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedHTML }}
        />

        <FooterSection />
      </div>
    </div>
  );
};

export default DoctorDetailPage;
