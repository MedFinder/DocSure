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
import { insurerOptions } from "../search/page";
import { doctorTypes } from "../home/page";
import Link from "next/link";

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
  return (
    <div className="min-h-screen w-full bg-[#F4E6D2]  ">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#F4E6D2] shadow-sm p-4 flex justify-between items-center z-50">
        <div className="flex justify-between items-center gap-6">
          <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={0}
            height={0}
            className="w-auto h-auto hidden md:flex  "
          />
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
          className="md:h-screen h-[70vh] flex flex-col items-center justify-center bg-[#F4E6D2] border-b relative"
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
          className="h-screen flex items-center justify-center bg-gray-200 border-b"
        >
          <h2 className="text-3xl font-semibold">About Us</h2>
          <p className="max-w-2xl text-center">
            We are a company that values innovation and customer satisfaction.
          </p>
        </section>
        <section
          id="services"
          className="h-screen flex items-center justify-center bg-gray-300 border-b"
        >
          <h2 className="text-3xl font-semibold">Our Services</h2>
          <p className="max-w-2xl text-center">
            We provide top-notch solutions tailored to your needs.
          </p>
        </section>
        <section
          id="portfolio"
          className="h-screen flex items-center justify-center bg-gray-400 border-b"
        >
          <h2 className="text-3xl font-semibold">Our Portfolio</h2>
          <p className="max-w-2xl text-center">
            Check out our latest projects and achievements.
          </p>
        </section>
        <section
          id="contact"
          className="h-screen flex items-center justify-center bg-gray-500 border-b"
        >
          <h2 className="text-3xl font-semibold">Contact Us</h2>
          <p className="max-w-2xl text-center">
            Reach out to us for any inquiries or collaborations.
          </p>
        </section>
      </main>
    </div>
  );
}
