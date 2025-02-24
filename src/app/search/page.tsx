//@ts-nocheck
"use client";
import Navbar from "@/components/general-components/navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import Column from "./features/column";

export default function SearchPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [callStatus, setCallStatus] = useState({
    isInitiated: false,
    ssid: "",
    email: "",
  });
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [extractedData, setExtractedData] = useState<TaskType[]>([]);

  const [activeCallIndex, setActiveCallIndex] = useState(0);
  const activeCallIndexRef = useRef(activeCallIndex);
  const [context, setcontext] = useState("");
  useEffect(() => {
    activeCallIndexRef.current = activeCallIndex;
  }, [activeCallIndex]);

  const timingOptions = [
    { value: "soonest", label: "As soon as possible" },
    { value: "this week", label: "This week" },
    { value: "next week", label: "Next week" },
    { value: "anytime", label: "No rush" },
  ];

  const availabilityOptions = [
    { value: "av-anytime", label: "I am available anytime" },
  ];
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
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = React.useState(false);
  const [showPanel, setShowPanel] = React.useState(false);
  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log(numbers)
    setPhoneNumbers(numbers);
  };

  // useEffect(() => {
  //   const storedData = sessionStorage.getItem("statusData");
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);
  //     const sortedData = parsedData.results.slice(0, 10).map((item, index) => ({
  //       ...item,
  //       id: item.place_id, // Keep unique ID
  //     }));
  //     setDoctors(sortedData);
  //   } else {
  //     router.push("/");
  //   }
  // }, [router]);
  const handleDragEnd = (event: any) => {
    if (isConfirmed) return; // Prevent reordering if call sequence has started

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // const oldIndex = doctors.findIndex((doctor) => doctor.id === active.id);
    // const newIndex = doctors.findIndex((doctor) => doctor.id === over.id);

    // const newSortedDoctors = arrayMove(doctors, oldIndex, newIndex).map(
    //   (doctor, index) => ({
    //     ...doctor,
    //     name: `${doctor.name.replace(/^\d+\.\s*/, "")}`, // Renumber dynamically
    //   })
    // );

    // setDoctors(newSortedDoctors);
  };
  return (
    <>
      <Navbar />
      <div className=" mt-24  md:hidden mx-2 px-4 ">
        <div className="flex flex-wrap  w-full ml-2 border md:border-gray-600 rounded-none overflow-hidden shadow-sm outline-none  gap-2 md:gap-0 ">
          {/* Search Icon */}

          {/* First Input */}
          <Input
            type="text"
            placeholder="Condition, procedure, doctor"
            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
          />

          {/* Location Icon */}

          {/* Second Input */}
          <Input
            type="text"
            placeholder="Address, city, zip code"
            className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm"
          />

          {/* Search Button */}
          <Link href="/search">
            <Button className="bg-[#FF6723] text-white rounded-none px-6 h-12 flex items-center justify-center w-full md:w-0">
              <Search className="text-white w-5 h-5 font-bold" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="md:flex justify-between mt-24 px-8 text-[#595959] py-4 border-b-2  text-sm ">
        <div className="flex md:gap-4  md:flex-row  flex-col gap-5">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms2" className="rounded-none" />
            <Label
              htmlFor="new-patient"
              className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Patient
            </Label>
          </div>

          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="data-[state=open]:bg-black data-[state=open]:text-white w-full md:w-auto  "
              >
                <Button
                  variant="outline"
                  className="rounded-full flex justify-start  text-start justify-items-start  "
                >
                  Timing
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="md:w-56  py-6 px-4 space-y-2">
                <RadioGroup className="flex flex-col gap-4">
                  {timingOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem id={option.value} value={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Select>
            <SelectTrigger className=" md:w-[180px] data-[state=open]:bg-black data-[state=open]:text-white rounded-full  w-full ">
              <SelectValue placeholder="Your availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="rounded-full flex justify-start  text-start justify-items-start w-full md:w-auto"
              >
                <Button variant="outline" className="rounded-full ">
                  Insurance
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 py-6 px-4 space-y-2">
                <div className="space-y-2">
                  <Label>Subscriber ID</Label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <Label>Group ID</Label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <Label>Insurer (optional)</Label>
                  <div className="py-2">
                    <Select name="insurer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurer" />
                      </SelectTrigger>
                      <SelectContent>
                        {insurerOptions.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 space-y-2">
                  <Checkbox id="terms2" className="rounded-none" />
                  <Label
                    htmlFor="terms2"
                    className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Don’t have insurance
                  </Label>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <p className="text-[#FF6723] mt-4 md:mt-0">
            Tip: You can re-arrange the priorty by dragging list items
          </p>
        </div>
      </div>
      <div className="bg-[#FFF6F2] p-4 px-7">
        <div className="flex items-center justify-between sm:gap-2">
          <p className=" text-xs md:text-base ">
            AI assistant will call the following recommended doctors in this
            sequence and seek an appointment for you.{" "}
          </p>{" "}
          <Link href="/contact" className="text-sm">
            <Button className="bg-[#FF6723] text-white md:p-5 p-4">
              Continue
            </Button>
          </Link>
        </div>
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <ScrollArea className="h-96 w-full">
          <Column
            activeCallIndex={activeCallIndex}
            tasks={doctors}
            // isDraggable={!isConfirmed}
            callStatus={callStatus}
            isAppointmentBooked={isAppointmentBooked}
          />
        </ScrollArea>
      </DndContext>
    </>
  );
}
