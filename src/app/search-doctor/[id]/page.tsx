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

  const [summaryMarkdown, setSummaryMarkdown] = useState("");
  const [imageMarkdown, setImageMarkdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const parsedHTML = DOMPurify.sanitize(marked.parse(summaryMarkdown || ""));
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!id) {
        console.error(
          "No place_id (id from params) found in URL parameters. Aborting API call."
        );
        setLoading(false);
        return;
      }

      try {
        // Retrieve and parse data from localStorage
        // Using 'doctorCallPayload' as per your code.
        // It's crucial that this 'doctorCallPayload' actually contains 'name', 'formatted_address', 'request_id'
        const doctorCallPayloadFromLocalStorage = JSON.parse(
          localStorage.getItem("doctorCallPayload") || "{}"
        );

        // Construct the full payload for the API
        const payload = {
          place_id: id, // This 'id' is coming from useParams()
          name: doctorCallPayloadFromLocalStorage?.name,
          formatted_address:
            doctorCallPayloadFromLocalStorage?.formatted_address,
          request_id: doctorCallPayloadFromLocalStorage?.request_id,
        };

        // Log the ACTUAL payload that will be sent
        console.log("API Payload being sent:", payload);

        const response = await axios.post(
          `https://callai-backend-243277014955.us-central1.run.app/api/get_doctor_profile`,
          payload // This is the 'payload' object
        );

        const result = response?.data?.result;

        if (result?.images && Array.isArray(result.images)) {
          setImageMarkdown(result.images);
        }

        if (result?.profile) {
          setSummaryMarkdown(result.profile);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch doctor details:", error); // More specific error message
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

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
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              className="rounded-md overflow-hidden"
            >
              {chunkArray(imageMarkdown, 4).map((group, slideIdx) => (
                <SwiperSlide key={slideIdx}>
                  <div className="grid grid-cols-4 gap-2">
                    {" "}
                    {group.map((src: any, idx: any) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Doctor Image ${slideIdx * 4 + idx + 1}`}
                        onError={handleImageError}
                        className="w-full object-cover h-[90px] sm:h-[100px] md:h-[130px] rounded-md" // Reduced heights
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
