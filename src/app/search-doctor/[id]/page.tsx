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
import { track } from "@vercel/analytics";
const DoctorDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [imageMarkdown, setImageMarkdown] = useState([]);
  const [summaryMarkdown, setSummaryMarkdown] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false); // Add state for global spinner
  const parsedHTML = DOMPurify.sanitize(marked.parse(summaryMarkdown || ""));
  useEffect(() => {
    // On mount, get doctorProfilePayload from localStorage
    const parseDrInfo = async () => {
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
    }
    parseDrInfo();
  }, []);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/fallback.jpg"; // Place a local fallback image in your public folder
  };
  const logCallPriority = async (updatedValues) => {
    const drsData = await JSON.parse(localStorage.getItem("statusData"));
    const data = {
      request_id: updatedValues.request_id,
      doctor_place_ids: drsData.results.map((doctor) => doctor.place_id),
      //call_priorities: drsData.results.map((_, index) => index)
    };
    // console.log(data);
    try {
      const resp = await axios.post(
        "https://callai-backend-243277014955.us-central1.run.app/api/update-doctor-call-priority",
        data
      );
      return;
    } catch (error) {
      return null;
    }
  };
  const onSubmit = async (values) => {
    track("DrProfile_BTN_Clicked");
    const formData = JSON.parse(localStorage.getItem("formData"));
    const savedSpecialty = formData?.specialty || "";


    const updatedValues = {
      specialty: savedSpecialty,
      request_id: formData?.request_id,
    };

    const existingFormData = localStorage.getItem("formData");
    let mergedValues = updatedValues;

    if (existingFormData) {
      try {
        const parsedExistingData = JSON.parse(existingFormData);
        // Merge existing data with new values (new values take precedence)
        mergedValues = { ...parsedExistingData, ...updatedValues };
      } catch (error) {
        console.error("Error parsing existing form data:", error);
      }
    }

    // Save the updated form data to localStorage
    localStorage.setItem("formData", JSON.stringify(mergedValues));
    await logCallPriority(updatedValues);
    router.push("/appointment");
  };
  const handleFormSubmit = async (index: number) => {
    setGlobalLoading(true); // Show global spinner
    const doctors = JSON.parse(
      localStorage.getItem("statusData") || "{}"
    ).results;
    const newDoctors = [...doctors];
    // Find the doctor by place_id that matches the current id parameter
    const doctorIndex = newDoctors.findIndex(doctor => doctor.place_id === id);
    if (doctorIndex === -1) {
      console.error("Doctor not found with place_id:", id);
      return;
    }
    // Move the selected doctor to the top of the list
    const selectedDoctor = newDoctors.splice(doctorIndex, 1)[0]; // Remove the selected doctor
    newDoctors.unshift(selectedDoctor); // Add the selected doctor to the top


    const storageKey = "statusData";

    const currentData = JSON.parse(localStorage.getItem(storageKey) || "{}");

    const updatedData = {
      ...currentData,
      results: newDoctors,
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    onSubmit();
  };

  const doctorCallPayloadFromLocalStorageForRender = JSON.parse(
    localStorage.getItem("doctorCallPayload") || "{}"
  );

  const chunkArray = (arr: any, size: any) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
const GlobalSpinner = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-5 rounded-full">
        <Loader2 className="w-10 h-10 text-[#E5573F] animate-spin" />
      </div>
    </div>
  );
};

  return (
    <div>
      <GlobalSpinner isVisible={globalLoading} />
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
          <div className="w-full relative">
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
              {chunkArray(imageMarkdown, 3).map((group, slideIdx) => (
                <SwiperSlide key={slideIdx}>
                  <div className="grid grid-cols-5 gap-2">
                    {group.map((src: any, idx: any) => (
                      <img
                        key={idx}
                        src={src.original}
                        width={src.original.width}
                        alt={`Doctor Image ${slideIdx * 4 + idx + 1}`}
                        onError={handleImageError}
                        className="w-full object-cover h-[70px] sm:h-[100px] md:h-[130px] rounded-md"
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Button
              className="absolute bottom-[-20px] rounded-md right-2 z-10 bg-[#E5573F] text-white hover:bg-[#c94a34]"
              onClick={() => handleFormSubmit()}
            >
              Book Now
            </Button>
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
