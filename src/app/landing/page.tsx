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
import { medicalSpecialtiesOptions } from "@/constants/store-constants";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import DoctorCardCarousel from "./components/DoctorCardCarousel";
import TestSwiper from "./components/test";
import TestimonialCarousel from "./components/Testimonial";
import TestimonialGrid from "./components/Testimonial";
import Places from "./components/Places";
import HealthConcerns from "./components/HealthConcerns";

const insurerOptions = [
  { value: "Aetna", label: "Aetna" },
  { value: "Aflac", label: "Aflac" },
  { value: "Alignment Healthcare", label: "Alignment Healthcare" },
  {
    value: "Allstate Insurance Company",
    label: "Allstate Insurance Company",
  },
  { value: "AlohaCare", label: "AlohaCare" },
  {
    value: "AMA Insurance Agency, Inc.",
    label: "AMA Insurance Agency, Inc.",
  },
  {
    value: "American Fidelity Assurance Company",
    label: "American Fidelity Assurance Company",
  },
  { value: "American Specialty Health", label: "American Specialty Health" },
  { value: "AmeriHealth", label: "AmeriHealth" },
  {
    value: "AmeriHealth Administrators",
    label: "AmeriHealth Administrators",
  },
  {
    value: "AmeriHealth Caritas Family of Companies",
    label: "AmeriHealth Caritas Family of Companies",
  },
  {
    value: "Arkansas BlueCross Blue Shield",
    label: "Arkansas BlueCross Blue Shield",
  },
  { value: "AultCare Corporation", label: "AultCare Corporation" },
  { value: "Avera Health Plans", label: "Avera Health Plans" },
  { value: "AvMed Health Plan", label: "AvMed Health Plan" },
  {
    value: "Bankers Life and Casualty Company",
    label: "Bankers Life and Casualty Company",
  },
  { value: "Birdsong Hearing Benefits", label: "Birdsong Hearing Benefits" },
  {
    value: "Blue Cross and Blue Shield of Georgia",
    label: "Blue Cross and Blue Shield of Georgia",
  },
  {
    value: "Blue Cross and Blue Shield of Illinois",
    label: "Blue Cross and Blue Shield of Illinois",
  },
  {
    value: "Blue Cross and Blue Shield of Montana",
    label: "Blue Cross and Blue Shield of Montana",
  },
  {
    value: "Blue Cross and Blue Shield of New Mexico",
    label: "Blue Cross and Blue Shield of New Mexico",
  },
  {
    value: "Blue Cross Blue Shield of Michigan",
    label: "Blue Cross Blue Shield of Michigan",
  },
  {
    value: "Blue Cross Blue Shield of North Carolina",
    label: "Blue Cross Blue Shield of North Carolina",
  },
  { value: "Blue Cross of Idaho", label: "Blue Cross of Idaho" },
  { value: "Blue Shield of California", label: "Blue Shield of California" },
  {
    value: "BlueCross BlueShield of Oklahoma",
    label: "BlueCross BlueShield of Oklahoma",
  },
  {
    value: "BlueCross BlueShield of Tennessee",
    label: "BlueCross BlueShield of Tennessee",
  },
  {
    value: "BlueCross BlueShield of Texas",
    label: "BlueCross BlueShield of Texas",
  },
  { value: "Cambia Health Solutions", label: "Cambia Health Solutions" },
  {
    value: "Capital District Physicians´ Health Plan",
    label: "Capital District Physicians´ Health Plan",
  },
  { value: "CareFirst", label: "CareFirst" },
  { value: "CareOregon", label: "CareOregon" },
  { value: "CareSource", label: "CareSource" },
  { value: "Celtic Insurance Company", label: "Celtic Insurance Company" },
  { value: "CENTENE Corp.", label: "CENTENE Corp." },
  { value: "Clever Care Health Plan", label: "Clever Care Health Plan" },
  { value: "CNO Financial Group", label: "CNO Financial Group" },
  {
    value: "Commonwealth Care Alliance",
    label: "Commonwealth Care Alliance",
  },
  {
    value: "Community Health Network of Connecticut",
    label: "Community Health Network of Connecticut",
  },
  { value: "Curative Inc", label: "Curative Inc" },
  { value: "CVS Health", label: "CVS Health" },
  { value: "Davies Life & Health", label: "Davies Life & Health" },
  { value: "Dean Health Plan, Inc.", label: "Dean Health Plan, Inc." },
  {
    value: "Delta Dental Plans Association",
    label: "Delta Dental Plans Association",
  },
  { value: "Elevance Health", label: "Elevance Health" },
  { value: "FedPoint", label: "FedPoint" },
  { value: "Fidelity", label: "Fidelity" },
  { value: "Florida Blue", label: "Florida Blue" },
  { value: "Gen Re", label: "Gen Re" },
  {
    value: "Guarantee Trust Life Insurance Company",
    label: "Guarantee Trust Life Insurance Company",
  },
  { value: "GuideWell", label: "GuideWell" },
  {
    value: "Harvard Pilgrim Health Care",
    label: "Harvard Pilgrim Health Care",
  },
  {
    value: "Health Alliance Medical Plan",
    label: "Health Alliance Medical Plan",
  },
  {
    value: "Health Care Service Corporation",
    label: "Health Care Service Corporation",
  },
  {
    value: "Health Net of California, Inc.",
    label: "Health Net of California, Inc.",
  },
  {
    value: "Health Net Community Solutions",
    label: "Health Net Community Solutions",
  },
  {
    value: "Health Plan of San Joaquin",
    label: "Health Plan of San Joaquin",
  },
  { value: "HealthEquity", label: "HealthEquity" },
  { value: "Healthfirst, Inc.", label: "Healthfirst, Inc." },
  { value: "HealthPartners", label: "HealthPartners" },
  { value: "Highmark Health", label: "Highmark Health" },
  { value: "Hometown Health Plan", label: "Hometown Health Plan" },
  {
    value: "Horizon BC/BS of New Jersey",
    label: "Horizon BC/BS of New Jersey",
  },
  { value: "Humana Inc.", label: "Humana Inc." },
  { value: "Independence Blue Cross", label: "Independence Blue Cross" },
  { value: "Independent Health", label: "Independent Health" },
  {
    value: "Insurance Administrative Solutions, L.L.C.",
    label: "Insurance Administrative Solutions, L.L.C.",
  },
  {
    value: "John Hancock Financial Services",
    label: "John Hancock Financial Services",
  },
  {
    value: "Johns Hopkins Health Plans",
    label: "Johns Hopkins Health Plans",
  },
  { value: "Kaiser Permanente", label: "Kaiser Permanente" },
  { value: "L.A. Care", label: "L.A. Care" },
  { value: "Liberty Dental Plan", label: "Liberty Dental Plan" },
  {
    value: "LifeSecure Insurance Company",
    label: "LifeSecure Insurance Company",
  },
  {
    value: "Local Initiative Health Authority",
    label: "Local Initiative Health Authority",
  },
  { value: "Magellan Health", label: "Magellan Health" },
  {
    value: "Martin’s Point Health Care",
    label: "Martin’s Point Health Care",
  },
  {
    value: "Mass General Brigham Health Plan",
    label: "Mass General Brigham Health Plan",
  },
  { value: "Medica Health Plan", label: "Medica Health Plan" },
  { value: "Medical Card System (MCS)", label: "Medical Card System (MCS)" },
  { value: "Medical Mutual of Ohio", label: "Medical Mutual of Ohio" },
  { value: "Meridian Health Plan", label: "Meridian Health Plan" },
  { value: "MetroPlusHealth", label: "MetroPlusHealth" },
  { value: "Metropolitan", label: "Metropolitan" },
  { value: "Moda Health", label: "Moda Health" },
  { value: "Molina Healthcare", label: "Molina Healthcare" },
  { value: "MVP Health Care", label: "MVP Health Care" },
  {
    value: "National General Accident & Health",
    label: "National General Accident & Health",
  },
  { value: "National Guardian Life", label: "National Guardian Life" },
  {
    value: "Neighborhood Health Plan of Rhode Island",
    label: "Neighborhood Health Plan of Rhode Island",
  },
  {
    value: "New York Life Insurance Company",
    label: "New York Life Insurance Company",
  },
  {
    value: "PacificSource Health Plans",
    label: "PacificSource Health Plans",
  },
  { value: "Paramount Health Care", label: "Paramount Health Care" },
  {
    value: "Physicians Mutual Insurance Company",
    label: "Physicians Mutual Insurance Company",
  },
  { value: "Point32Health", label: "Point32Health" },
  { value: "Providence Health Plans", label: "Providence Health Plans" },
  { value: "Quartz Health Solutions", label: "Quartz Health Solutions" },
  { value: "Regence BC/BS of Oregon", label: "Regence BC/BS of Oregon" },
  { value: "Regence Blue Shield", label: "Regence Blue Shield" },
  {
    value: "Regence BlueCross BlueShield of Utah",
    label: "Regence BlueCross BlueShield of Utah",
  },
  {
    value: "Regence BlueShield of Idaho",
    label: "Regence BlueShield of Idaho",
  },
  { value: "Sanford Health Plans", label: "Sanford Health Plans" },
  { value: "SCAN Health Plan", label: "SCAN Health Plan" },
  { value: "Sentara Healthcare", label: "Sentara Healthcare" },
  { value: "Sharp Health Plan", label: "Sharp Health Plan" },
  { value: "St. Luke’s Health Plan", label: "St. Luke’s Health Plan" },
  {
    value: "State Farm Insurance Companies",
    label: "State Farm Insurance Companies",
  },
  { value: "SummaCare", label: "SummaCare" },
  { value: "Sutter Health Plan", label: "Sutter Health Plan" },
  { value: "Swiss Re America", label: "Swiss Re America" },
  { value: "The Cigna Group", label: "The Cigna Group" },
  {
    value: "Thrivent Financial for Lutherans",
    label: "Thrivent Financial for Lutherans",
  },
  {
    value: "Trustmark Insurance Company",
    label: "Trustmark Insurance Company",
  },
  { value: "Tufts Health Plan", label: "Tufts Health Plan" },
  { value: "UCare", label: "UCare" },
  {
    value: "UNICARE Life & Health Insurance Company",
    label: "UNICARE Life & Health Insurance Company",
  },
  { value: "UnitedHealthcare", label: "UnitedHealthcare" },
  {
    value: "University Health Alliance",
    label: "University Health Alliance",
  },
  {
    value: "UPMC Health Insurance Plans",
    label: "UPMC Health Insurance Plans",
  },
  { value: "USAA", label: "USAA" },
  { value: "VIVA Health, Inc.", label: "VIVA Health, Inc." },
  { value: "Wellabe", label: "Wellabe" },
  { value: "Wellfleet", label: "Wellfleet" },
  { value: "Western Health Advantage", label: "Western Health Advantage" },
  { value: "Zurich North America", label: "Zurich North America" },
];
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
            className="w-auto h-auto hidden md:flex  "
          />
          {/* <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={169}
            height={36}
            className="hidden md:flex  "
          /> */}
          <Image
            src="/mobile-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-auto h-auto block md:hidden"
          />
          <div className="space-x-6 hidden md:block">
            <a href="#home" className="hover:text-[#E5573F]">
              Doctors
            </a>
            <a href="#home" className="hover:text-[#E5573F]">
              Specialties
            </a>
          </div>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <a href="#home" className="hover:text-[#E5573F]">
            How it works
          </a>
          <a href="#about" className="hover:text-[#E5573F]">
            Locations
          </a>
          <a href="#services" className="hover:text-[#E5573F]">
            Insurance Plans
          </a>
          <a href="#portfolio" className="hover:text-[#E5573F]">
            Help
          </a>
          <Button className="text-white bg-[#0074BA] rounded-md">
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
              <a
                href="#home"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                How it works
              </a>
              <a
                href="#about"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                Locations
              </a>
              <a
                href="#services"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                Insurance Plans
              </a>
              <a
                href="#portfolio"
                className="hover:text-[#E5573F]"
                onClick={() => setIsOpen(false)}
              >
                Help
              </a>

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
              <h2 className="text-xl">
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
                        options={insurerOptions}
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
              <span className="text-xs text-gray-900 whitespace-nowrap pt-2">
                Medical specialty
              </span>
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
                href=""
                className="text-[#E5573F] flex gap-1 pt-6 md:pt-16 hover:text-black"
              >
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="services"
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
          id="portfolio"
          className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2] border-b md:pt-16 md:pb-16 py-8 pb-16 px-0   "
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
        <section className="relative flex flex-col items-center justify-center gap-10 bg-white  md:pt-16 md:pb-16 pt-8 px-0  pb-0">
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
        <section className="flex flex-col items-center justify-center gap-10 bg-[#FCF8F2]  border-b md:pt-16 md:pb-16 py-8 px-0   ">
          <h2 className="text-3xl md:px-44 mb-4 ">Browse Locations</h2>
          <Places />
          <div className="px-20 bg-white  border-lg py-14 flex flex-col items-center justify-center">
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
