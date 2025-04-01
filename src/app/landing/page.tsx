//@ts-nocheck
"use client";
import { useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  Book,
  BookText,
  Loader2,
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "../../../components/ui/autocomplete";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { insuranceCarrierOptions, medicalSpecialtiesOptions } from "@/constants/store-constants";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import DoctorCardCarousel from "./components/DoctorCardCarousel";
import TestSwiper from "./components/test";
import TestimonialCarousel from "./components/Testimonial";
import TestimonialGrid from "./components/Testimonial";
import Places from "./components/Places";
import HealthConcerns from "./components/HealthConcerns";

const doctorTypes = [
  { value: "Dermatologist", label: "Dermatologist" },
  {
    value: "Cardiologist / Heart Doctor",
    label: "Cardiologist / Heart Doctor",
  },
  {
    value: "Neurologist / Headache Specialist",
    label: "Neurologist / Headache Specialist",
  },
  { value: "Pediatrician", label: "Pediatrician" },
  { value: "Dentist", label: "Dentist" },
  { value: "Psychiatrist", label: "Psychiatrist" },
  { value: "Ophthalmologist", label: "Ophthalmologist" },
  {
    value: "Orthopedic Surgeon / Orthopedist",
    label: "Orthopedic Surgeon / Orthopedist",
  },
];
const moreDoctorTypes = [
  { value: "Dermatologist", label: "Dermatologist" },
  {
    value: "Cardiologist / Heart Doctor",
    label: "Cardiologist / Heart Doctor",
  },
  {
    value: "Neurologist / Headache Specialist",
    label: "Neurologist / Headache Specialist",
  },
  { value: "Pediatrician", label: "Pediatrician" },
  { value: "Dentist", label: "Dentist" },
  { value: "Psychiatrist", label: "Psychiatrist" },
  { value: "Ophthalmologist", label: "Ophthalmologist" },
  {
    value: "Orthopedic Surgeon / Orthopedist",
    label: "Orthopedic Surgeon / Orthopedist",
  },
  { value: "Endocrinologist", label: "Endocrinologist" },
  { value: "Gastroenterologist", label: "Gastroenterologist" },
  { value: "Hematologist", label: "Hematologist" },
  {
    value: "Nephrologist / Kidney Specialist",
    label: "Nephrologist / Kidney Specialist",
  },
];

const scrollToSection = (id: string, offset: number) => {
  const element = document.getElementById(id);
  if (element) {
    const topPosition = element.offsetTop - offset; // Calculate position with offset
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
};

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const handleDoctorTypeClick = (value: any) => {
    setSelectedSpecialty(value); // Update specialty when button is clicked
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A",
    libraries: ["places"],
  });
  const insuranceFirstLogos = [
    { src: "/image 6.svg", alt: "Insurance Network 1" },
    { src: "/image 7.svg", alt: "Insurance Network 2" },
    { src: "/image 18 (1).svg", alt: "Insurance Network 3" },
    { src: "/image 9.svg", alt: "Insurance Network 4" },
    { src: "/image 17 (1).svg", alt: "Insurance Network 5" },
    { src: "/image 8.svg", alt: "Insurance Network 6" },
  ];
  const insuranceSecondLogos = [
    { src: "/image 6.svg", alt: "Insurance Network 1" },
    { src: "/image 11.svg", alt: "Insurance Network 1" },
    { src: "/image 12.svg", alt: "Insurance Network 1" },
    { src: "/image 13.svg", alt: "Insurance Network 1" },
  ];
  return (
    <div className="min-h-screen w-full bg-[#FCF8F1]  ">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50  text-sm">
        <div className="flex justify-between items-center gap-6">
          <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-28 h-auto hidden md:flex"
          />
          <Image
            src="/mobile-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-auto h-auto block md:hidden"
          />
          <div className="space-x-6 hidden md:block">
            <Link
              href="#"
              className="hover:text-[#E5573F]"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                scrollToSection("doctors", 60); // Scroll to 'doctors' section with 80px offset
              }}
            >
              Doctors
            </Link>
            <Link
              href="#"
              className="hover:text-[#E5573F]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("specialties", 60);
              }}
            >
              Specialties
            </Link>
          </div>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("how_it_works", 60);
            }}
          >
            How it works
          </Link>
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("locations", 60);
            }}
          >
            Locations
          </Link>
          <Link
            href="#"
            className="hover:text-[#E5573F]"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("insurance_plans", 70);
            }}
          >
            Insurance Plans
          </Link>
          <Link
            className="hover:text-[#E5573F]"
            onClick={() => track("Help_Btn_Clicked")}
            href="/contact-us"
          >
            Help
          </Link>
          <Button onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }} className="text-white bg-[#0074BA] rounded-md">
            Get Started
          </Button>
        </div>

        <div className="md:hidden flex space-x-4">
          <Button className="text-white bg-[#0074BA] rounded-md block md:hidden text-xs ">
            Get Started
          </Button>
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <AlignLeft size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 bg-white h-full p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mb-4 flex " onClick={() => setIsOpen(false)}>
              <X size={24} /> <p className="text-[#E5573F] space-x-1"></p>
            </button>

            <nav className="flex flex-col space-y-4">
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how_it_works", 60);
                }}
              >
                How it works
              </Link>
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("locations", 60);
                }}
              >
                Locations
              </Link>
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("insurance_plans", 60);
                }}
              >
                Insurance Plans
              </Link>
              <Link
                className="hover:text-[#E5573F]"
                onClick={() => track("Help_Btn_Clicked")}
                href="/contact-us"
              >
                Help
              </Link>

              {/* <a
                href="#contact"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a> */}
            </nav>
          </div>
        </div>
      )}

      {/* Sections */}
      <main className="">
        <section
          id="home"
          className="md:h-screen h-[70vh] flex flex-col items-center justify-center bg-[#FCF8F1]  border-b relative"
        >
          <div className="flex flex-col text-center items-center w-full px-6 sm:px-20 lg:px-40 space-y-8 z-10">
            <div className="space-y-2">
              <h2 className="text-4xl text-[#E5573F]">
                Book top rated doctors near you
              </h2>
              <h2 className="text-xl font-normal">
                Let AI call doctors and secure appointments for you.
              </h2>
            </div>

            <div className="flex gap-2 w-full pt-4">
              <div className="flex flex-col md:flex-row w-full bg-white rounded-md border border-black">
                {/* Specialty and location inputs */}
                <div className="flex flex-col sm:flex-row flex-grow w-full">
                  {/* Specialty section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-400 md:border-none">
                      <Autocomplete
                        id="specialty"
                        name="specialty"
                        className="w-full"
                        options={medicalSpecialtiesOptions}
                        placeholder="Medical specialty"
                        value={selectedSpecialty}
                        selected={selectedSpecialty}
                        onChange={(value) => setSelectedSpecialty(value)}
                        clearable={false}
                      />
                    </div>
                  </div>
                  {/* Insurer section */}
                  <div className="flex items-center w-full sm:w-auto sm:flex-1">
                    <div className="flex items-center justify-center px-3">
                      <BookText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-400 md:border-none">
                      <Autocomplete
                        id="insurer"
                        name="insurer"
                        className="w-full"
                        options={insuranceCarrierOptions}
                        placeholder="Insurance carrier (optional)"
                        onChange={() => {}}
                        clearable={false}
                      />
                    </div>
                  </div>
                  {/* Location section */}
                  <div className="flex items-center w-full sm:flex-1">
                    <div className="flex items-center justify-center px-3 h-full">
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      {isLoaded && (
                        <StandaloneSearchBox>
                          <Input
                            type="text"
                            placeholder="Address, city, zip code"
                            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
                            autoComplete="off"
                            aria-autocomplete="none"
                          />
                        </StandaloneSearchBox>
                      )}
                    </div>
                  </div>
                  <div className="mx-3">
                    <Button className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 my-4 h-12 items-center justify-center w-full md:w-auto md:hidden">
                      <Search className="w-5 h-5 text-white" /> Search
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="bg-[#E5573F] rounded-md text-white space-x-2 px-6 h-12 md:flex items-center justify-center w-full md:w-auto hidden">
                <Search className="w-5 h-5 text-white" /> Search
              </Button>
            </div>

            {/* Specialty Selection */}
            <div className="md:flex gap-4 md:pt-4 pt-0 hidden">
              <div className="sm:flex-wrap sm:gap-3 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 pb-2">
                {doctorTypes.map((value, index) => (
                  <Button
                    key={index}
                    className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                      selectedSpecialty === value.value
                        ? "bg-slate-800 text-white" // Selected state
                        : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800" // Normal state
                    }`}
                    onClick={() => handleDoctorTypeClick(value.value)}
                  >
                    {value.label}
                  </Button>
                ))}
              </div>
            </div>

            <Link
              href="/search"
              className="text-[#E5573F] md:flex space-x-2 items-center hidden"
            >
              <p>Search for a doctor, hospital or medical group</p>
              <ArrowRight />
            </Link>
          </div>

          {/* Images positioned at the bottom edges */}
          <Image
            src="/doctor-doing-their-work-pediatrics-office 1.svg"
            alt="Doctor"
            width={0}
            height={0}
            className="absolute bottom-0 left-0 w-auto h-auto max-w-[180px] md:max-w-[250px] hidden md:block"
          />
          <Image
            src="/serious-mature-doctor-eyeglasses-sitting-table-typing-laptop-computer-office 1.svg"
            alt="Doctor"
            width={0}
            height={0}
            className="absolute bottom-0 right-0 w-auto h-auto max-w-[180px] md:max-w-[250px] hidden md:block"
          />
        </section>

        <section
          id="about"
          className=" md:flex flex-col items-center justify-center gap-24 bg-white border-b md:py-12 px-0 md:px-64 hidden"
        >
          <div className="flex gap-12 px-14">
            <div className="pt-24 px-4">
              <p className="text-2xl ">Find doctors in any insurance network</p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {insuranceFirstLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={0}
                    height={0}
                    className="w-auto h-auto hidden md:flex"
                  />
                ))}
              </div>
              <Link
                onClick={(e)=>  {
                  e.preventDefault()
                  scrollToSection("home", 40)
                }} 
                href=""
                className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
            <div>
              <Image
                src="/Group 233.svg"
                alt="doctor"
                width={600}
                height={600}
                className=""
              />
            </div>
          </div>{" "}
          <div className="flex gap-12 px-14">
            <div className="bg-[#0074BA] rounded-2xl relative flex justify-between items-center">
              {/* Left Content - Texts and Stars */}
              <div className="flex flex-col justify-start text-left pl-6 gap-4">
                <p className="text-white text-3xl">Top-rated providers</p>
                <p className="text-white">
                  Compare across hundreds of public reviews
                </p>

                {/* Star Container */}
                <div className="relative w-full flex flex-col items-center pr-16 mt-4">
                  {/* Top 3 Stars */}
                  <div className="flex gap-4">
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Bottom 2 Stars */}
                  <div className="flex gap-4 mt-2">
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/Star 7.svg"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>

              {/* Right Content - Images */}
              <div className="relative h-full w-[70%] flex items-center justify-center">
                {/* Background Mask Group - Full Width & Height */}
                <Image
                  src="/Mask group (1).svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />

                {/* Foreground Group 167 - Full Height */}
                <Image
                  src="/Group 167.svg"
                  alt="Doctor Illustration"
                  width={300}
                  height={800}
                  className="relative h-full object-contain"
                />
              </div>
            </div>

            <div className="pt-10 px-4">
              <p className="text-3xl ">Find providers at top health systems</p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {insuranceSecondLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={0}
                    height={0}
                    className="w-auto h-auto hidden md:flex"
                  />
                ))}
              </div>
              <Link
              onClick={(e)=>  {
                e.preventDefault()
                scrollToSection("home", 40)
                }} 
                href=""
                className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="flex  px-14">
            <div className="pt-20 w-[50%] ">
              <p className="text-3xl ">Find doctors accepting new patients</p>
              <p className="pt-4 text-sm">
                Same-day and last-minute appointments
              </p>
              <Link
                onClick={(e)=>  {
                  e.preventDefault()
                  scrollToSection("home", 40)
                }} 
                href=""
                className=" text-[#E5573F] flex gap-1 pt-16 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
            <div className="bg-[#2CA07F] rounded-2xl relative flex items-center h-80 overflow-hidden w-[60%]">
              {/* Left Content - Texts (Slightly Overlapping Images) */}
              <div className="absolute bottom-6 left-6 z-10 flex flex-col text-left gap-2 bg-opacity-50 ">
                <p className="text-white text-3xl  leading-tight w-[65%]">
                  No insurance, no problem
                </p>
                <p className="text-white w-1/2">
                  Find doctors that accept self-pay
                </p>
              </div>

              {/* Right Content - Images Fully to the Right */}
              <div className="relative w-full h-full flex justify-end ">
                {/* Background Mask - Covers Right Half */}
                <Image
                  src="/Mask group.svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 right-0 w-full h-full"
                />

                {/* Foreground - Doctor Image (Right-Aligned & Text Overlap) */}
                <Image
                  src="/doc-and-nurse.svg"
                  alt="Doctor Illustration"
                  width={400}
                  height={500}
                  className="relative h-full object-cover ml-auto"
                />
              </div>
            </div>
          </div>
        </section>
        {/* mobile view for 2nd section */}
        <section
          id="about"
          className=" flex-col items-center justify-center gap-24 bg-white border-b pt-6 md:px-64 md:hidden block text-left"
        >
          {/* First Section */}
          <div className="flex flex-col md:flex-row gap-12 px-4 md:px-14">
            <div className="flex justify-center">
              <Image
                src="/Group 233.svg"
                alt="doctor"
                width={400}
                height={400}
                className="md:w-[600px] md:h-[600px]"
              />
            </div>
          </div>
          <div className="pt-10 px-4 ">
            <p className="text-2xl md:text-3xl">
              Find doctors in any insurance network
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6">
              {insuranceFirstLogos.map((logo, index) => (
                <Image
                  key={index}
                  src={logo.src}
                  alt={logo.alt}
                  width={0}
                  height={0}
                  className="w-auto h-auto"
                />
              ))}
            </div>
            <Link
              onClick={(e)=>  {
                e.preventDefault()
                scrollToSection("home", 40)
              }} 
              href=""
              className="text-[#E5573F] flex gap-1 pt-8 md:pt-12 hover:text-black"
            >
              Get Started <ArrowRight />
            </Link>
          </div>

          {/* Second Section */}
          <div className="flex flex-col md:flex-row gap-6 px-4 pt-8 ">
            <div
              className="bg-[#0074BA] rounded-2xl relative flex h-64
             md:flex-row justify-between items-center pl-4 md:p-6"
            >
              {/* Left Content */}
              <div className="flex flex-col justify-start text-left gap-1 md:gap-2 md:pl-6 w-full">
                <p className="text-white text-2xl md:text-3xl">
                  Top-rated providers
                </p>
                <p className="text-white text-sm pt-2">
                  Compare across hundreds of public reviews
                </p>

                {/* Star Container */}
                <div
                  className="relative flex flex-col items-center pr-8
                  md:pr-16 mt-1 md:mt-4"
                >
                  <div className="flex gap-4 pt-2">
                    {[...Array(3)].map((_, i) => (
                      <Image
                        key={i}
                        src="/Star 7.svg"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4  mt-1 md:mt-2">
                    {[...Array(2)].map((_, i) => (
                      <Image
                        key={i}
                        src="/Star 7.svg"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="relative w-full md:w-[70%] flex items-center justify-center h-full">
                <Image
                  src="/Mask group (1).svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
                <Image
                  src="/Group 167.svg"
                  alt="Doctor Illustration"
                  width={180}
                  height={400}
                  className="relative h-full  md:max-h-none object-contain"
                />
              </div>
            </div>

            <div className="pt-6 text-left">
              <p className="text-2xl">Find providers at top health systems</p>
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6 md:pt-4">
                {insuranceSecondLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={0}
                    height={0}
                    className="w-auto h-8 md:h-auto flex"
                  />
                ))}
              </div>
              <Link
                onClick={(e)=>  {
                  e.preventDefault()
                  scrollToSection("home", 40)
                }} 
                href=""
                className="text-[#E5573F] flex gap-1 pt-4 md:pt-12 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Third Section */}
          <div className="flex flex-col md:flex-row gap-12 px-4 md:px-14 pt-8">
            <div className="bg-[#2CA07F] rounded-2xl relative flex items-center h-64 w-full md:w-[60%] overflow-hidden">
              {/* Left Content - Slightly Overlapping Images */}
              <div
                className="absolute 
               left-2 w-56 z-10 flex flex-col text-left gap-1 md:gap-2"
              >
                <p className="text-white text-2xl md:text-3xl leading-tight w-[80%] md:w-[65%]">
                  No insurance, no problem
                </p>
                <p className="text-white w-4/5 md:w-2/3 text-sm md:text-base">
                  Find doctors that accept self-pay
                </p>
              </div>

              {/* Right Content - Images Fully to the Right */}
              <div className="relative w-full h-full flex justify-end">
                <Image
                  src="/Mask group.svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="absolute top-0 right-0 w-full h-full"
                />
                <Image
                  src="/doc-and-nurse.svg"
                  alt="Doctor Illustration"
                  width={250}
                  height={500}
                  className="relative h-full object-cover ml-auto"
                />
              </div>
            </div>
            <div className=" md:pt-20 w-full md:w-[50%] text-left pb-14">
              <p className="text-2xl md:text-3xl">
                Find doctors accepting new patients
              </p>
              <p className="pt-2 ">Same-day and last-minute appointments</p>
              <Link
                onClick={(e)=>  {
                  e.preventDefault()
                  scrollToSection("home", 40)
                }} 
                href=""
                className="text-[#E5573F] flex gap-1 pt-6 md:pt-16 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how_it_works"
          className="flex flex-col items-center justify-center gap-10 bg-[#0074BA] border-b md:py-16 py-8 px-0 md:px-44 text-white  "
        >
          <h2 className="text-3xl ">How it works</h2>
          <p className="md:max-w-lg px-8 md:px-0 text-center">
            Skip the hassle of calling multiple doctor's offices. Our AI takes
            care of your scheduling needs.
          </p>
          <div className="md:grid grid-cols-3 flex flex-col px-4 gap-12 md:pt-4 pt-0">
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-12 pb-6 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 189.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%] w-60 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40 ">
                  <p className=" text-center pt-4">
                    Enter your appointment details
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-24 pb-12 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 190.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%] w-60 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40">
                  <p className=" text-center pt-4">
                    Our AI makes the calls and books the appointment
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="relative flex justify-center">
              <div className="bg-[#0C679F] rounded-xl px-20 pb-12 relative">
                {/* Floating Image (Slightly Above) */}
                <Image
                  src="/Group 191.svg"
                  alt="call Logo"
                  width={220}
                  height={320}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%]  w-48 h-auto"
                />

                {/* Text Content */}
                <div className=" pt-40">
                  <p className=" text-center pt-6">
                    Receive instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="doctors"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 pb-16 px-0"
        >
          <h2 className="text-3xl md:px-44 mb-10 px-4 flex text-center">
            Top-rated doctors in your area
          </h2>
          <DoctorCardCarousel />
        </section>
        <section className="flex flex-col items-center justify-center gap-10 bg-[#E5573F] text-white border-b md:pt-16 md:pb-16 py-8 px-0   ">
          <h2 className="text-3xl md:px-44 mb-4 text-white ">
            Patients love Docsure
          </h2>
          <TestimonialCarousel />
        </section>
        <section
          id="specialties"
          className="relative flex flex-col items-center justify-center gap-10 bg-white  md:pt-16 md:pb-16 pt-8 px-0  pb-0"
        >
          {/* Section Heading */}
          <h2 className="text-3xl md:px-44 px-4 flex text-center">
            Browse specialties
          </h2>

          {/* Doctor Specialties Buttons */}
          <div className="sm:flex-wrap sm:gap-3 flex flex-wrap justify-center gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 md:px-40">
            {moreDoctorTypes.map((value, index) => (
              <Button
                key={index}
                className={`rounded-full text-xs px-3 py-2 w-auto flex-shrink-0 ${
                  selectedSpecialty === value.value
                    ? "bg-slate-800 text-white" // Selected state
                    : "bg-[#EFEADE] text-[#202124] hover:text-white hover:bg-slate-800" // Normal state
                }`}
                onClick={() => handleDoctorTypeClick(value.value)}
              >
                {value.label}
              </Button>
            ))}
          </div>

          {/* Positioned Image Slightly Above Bottom with No Extra Space Below */}
          <div className="absolute bottom-[-90px] left-0 w-full flex justify-start pl-12">
            <Image
              src="/OBJECTS.svg"
              alt="Decorative Star"
              width={200}
              height={200}
              className="hidden md:block"
            />
          </div>
        </section>
        <section className="bg-white h-[88px]"></section>
        <section
          id="locations"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2]  border-b md:pt-16 md:pb-16 py-8 px-0   "
        >
          <h2 className="text-3xl md:px-44 mb-4 ">Browse Locations</h2>
          <Places />
          <div
            id="insurance_plans"
            className="px-20 bg-white  border-lg py-14 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl mb-4 whitespace-nowrap ">
              Browse insurance plans
            </h2>

            <div className="flex flex-col pt-4">
              {/* First Row - 6 Columns */}
              <div className="grid md:grid-cols-6 grid-cols-2 gap-8 md:gap-0 justify-center pt-4">
                {insuranceFirstLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={0}
                    height={0}
                    className="w-auto h-auto  md:flex"
                  />
                ))}
              </div>

              {/* Second Row - 3 Columns */}
              <div className="flex gap-4 justify-center pt-6">
                {insuranceSecondLogos.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={0}
                    height={0}
                    className="w-auto h-auto hidden md:flex"
                  />
                ))}
              </div>
            </div>
            <Link
              onClick={(e)=>  {
                e.preventDefault()
                scrollToSection("home", 40)
              }}
              href=""
              className=" flex justify-center gap-1 pt-12 hover:text-gray-700"
            >
              Get Started <ArrowRight />
            </Link>
          </div>
          <div>
            <HealthConcerns />
          </div>
        </section>
        <section className="bg-white py-8 flex flex-col  justify-center items-center">
          <Image
            src="/Vector (9).svg"
            alt="New Logo"
            width={40}
            height={40}
            className=""
          />
          <p>© 2025 Docure AI Inc.</p>
          <div className="flex gap-2">
            <Link href="">Terms</Link>
            <Link href="">Privacy</Link>
            <Link href="">Home</Link>
            <Link href="">Contact Us</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
