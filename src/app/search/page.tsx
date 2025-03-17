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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Column from "./features/column";
import SortableDoctor from "./features/column";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { track } from "@vercel/analytics";

const validationSchema = Yup.object().shape({
  objective: Yup.string().required("Required"),
});

const availabilityOptions = [{ value: "yes", label: "Available anytime" }];
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

const timingOptions = [
  { value: "today", label: "Today" },
  { value: "few days", label: "Few days" },
  { value: "two weeks", label: "Two weeks" },
  { value: "2+ weeks", label: "2+ weeks" },
];
const insurance_types = [
  { value: "PPO", label: "PPO" },
  { value: "HMO", label: "HMO" },
];
export default function SearchPage() {
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState<(string | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(true);
  const [customAvailability, setCustomAvailability] = useState("");
  const [timeOfAppointment, settimeOfAppointment] = useState("few days");
  const [insuranceType, setinsuranceType] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const getPhoneNumbers = () => {
    const numbers = doctors.map((doctor) => doctor.phone_number || null);
    // console.log(numbers)
    setPhoneNumbers(numbers);
  };

  // useEffect(() => {
  //   const storedData = sessionStorage.getItem("statusData");
  //   const storedDataNav = sessionStorage.getItem("statusDataNav");

  //   if (storedData || storedDataNav) {
  //     const parsedData = JSON.parse(storedData || storedDataNav);
  //     const sortedData = parsedData.results.slice(0, 10).map((item, index) => ({
  //       ...item,
  //       id: item.place_id, // Keep unique ID
  //     }));

  //     // if (typeof window !== "undefined") {
  //     //   const storedSearchData = sessionStorage.getItem("searchData");
  //     //   if (storedSearchData) {
  //     //     const parsedDataB = JSON.parse(storedSearchData);
  //     //     setSearchData(parsedData);
  //     //     console.log("Retrieved Data:", parsedDataB); // Logs when the component mounts
  //     //   }
  //     // }
  //     setDoctors(sortedData);
  //   } else {
  //     router.push("/");
  //   }
  // }, [router]);
  useEffect(() => {
    const updateDoctorsList = () => {
      try {
        const lastSearchSource = sessionStorage.getItem("lastSearchSource");
        let rawData;

        if (lastSearchSource === "navbar") {
          rawData = sessionStorage.getItem("statusDataNav");
        } else {
          rawData = sessionStorage.getItem("statusData");
        }

        if (!rawData) {
          router.push("/");
          return;
        }

        const parsedData = JSON.parse(rawData);
        if (parsedData?.results?.length) {
          const sortedData = parsedData.results?.map((item) => ({
            ...item,
            id: item.place_id || item.id,
          }));

          setDoctors(sortedData);
        } else {
          console.warn("No valid results found in sessionStorage.");
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        setDoctors([]);
      }
    };

    // Initial load
    updateDoctorsList();

    // Listen for storage changes (detect when a new search is performed)
    const handleStorageChange = () => updateDoctorsList();
    window.addEventListener("storage", handleStorageChange);

    // Also detect route changes (e.g., navigating from home to search)
    const handleRouteChange = () => updateDoctorsList();
    router.events?.on("routeChangeComplete", handleRouteChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  const handleDelete = (id: string) => {
    setDoctors((prevDoctors) =>
      prevDoctors.filter((doctor) => doctor.id.toString() !== id)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = doctors.findIndex((doctor) => doctor.id === active.id);
    const newIndex = doctors.findIndex((doctor) => doctor.id === over.id);

    const newSortedDoctors = arrayMove(doctors, oldIndex, newIndex).map(
      (doctor, index) => ({
        ...doctor,
        name: `${doctor.name.replace(/^\d+\.\s*/, "")}`, // Renumber dynamically
      })
    );

    setDoctors(newSortedDoctors);
  };

  useEffect(() => {
    if (doctors.length) {
      // console.log(doctors)
      getPhoneNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors]);

  useEffect(() => {
    if (selectedInsurance === true) {
      formik.setFieldValue("subscriberId", "");
      formik.setFieldValue("groupId", "");
      formik.setFieldValue("insurer", "");
      setinsuranceType("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsurance]);
  const formik = useFormik({
    initialValues: {
      specialty: "",
      objective: "",
      maxWait: "",
      availability: "",
      insurer: "",
      subscriberId: "",
      groupId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
    track('Searchpage_Continue_Btn_Clicked');
     // console.log("here");
     const savedSpecialty = sessionStorage.getItem("selectedSpecialty");
     // console.log("Objective value:", values.objective);

     if (!values.objective || !values.objective.trim()) {
       toast.error("Please fill up all the required information");
       return;
     }

     //console.log("Form values:", values);

     const updatedValues = {
       groupId: values.groupId,
       subscriberId: values.subscriberId,
       objective: values.objective,
       insurer: values.insurer,
       selectedOption: selectedInsurance === true ? "no" : "yes",
       availability: customAvailability ? customAvailability: availabilityOptions[0].label,
       specialty: savedSpecialty,
       timeOfAppointment,
       insuranceType,
       maxWait: timeOfAppointment,
       isNewPatient: isNewPatient ? "yes" : "no",
     };

     sessionStorage.setItem("formData", JSON.stringify(updatedValues));

     // console.log("Stored formData in sessionStorage:", updatedValues);

     // Redirect to search page
     setTimeout(() => {
       router.push("/contact");
     }, 500);
   },
  });
  
  // Add this function to handle manual submission with toast error
  const handleFormSubmit = () => {
    // Touch all fields to trigger validation
    formik.validateForm().then(errors => {
      // If there are validation errors
      if (Object.keys(errors).length > 0) {
        // Set all fields as touched to show validation errors
        const touchedFields = {};
        Object.keys(formik.values).forEach(key => {
          touchedFields[key] = true;
        });
        formik.setTouched(touchedFields);
        
        // Show toast error
        toast.error("Please fill up all the required information");
        return;
      }
      
      // If no errors, submit the form
      formik.handleSubmit();
    });
  };

  const handleOnPlacesChanged = (index) => {
    if (inputRefs.current[index]) {
      const places = inputRefs.current[index].getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
      }
    }
  };

  return (
    <>
      <Navbar />
      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center ">
          <p className="text-2xl sm:text-4xl my-6 font-semibold text-[#333333]">
            No results found!
          </p>
          <p className="text-gray-500 mt-2">
            We could not find any doctors that meet this criteria.
          </p>
          <Link href="/">
            <Button className=" bg-[#7DA1B7] text-white px-6 py-5 mt-8 w-full sm:w-auto">
              Search Again
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className=" border border-t-2">
          {/* Filters Section */}
          <div className="md:flex  flex md:flex-row  flex-col justify-between md:mt-24 mt-36 px-8 text-[#595959] py-2 border-b-2 text-sm">
            <div className="flex md:gap-4 flex-row gap-5  overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide md:overflow-visible px-1 pb-2  md:pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-patient"
                  checked={isNewPatient}
                  onCheckedChange={(value) => setIsNewPatient(value)}
                  className="rounded-none"
                />
                <Label htmlFor="new-patient" className="font-medium">
                  New Patient
                </Label>
              </div>

              {/* Health Concerns */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    Health concerns{" "}
                    <span className="text-red-500 text-xl flex items-center pt-1">
                      *
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 py-6 px-4 space-y-2">
                  <Textarea
                    name="objective"
                    placeholder="Knee pain, fever, skin rash..."
                    onChange={formik.handleChange}
                    value={formik.values.objective}
                    className={
                      formik.errors.objective && formik.touched.objective
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {formik.errors.objective && formik.touched.objective && (
                    <div className="text-red-500">Required</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`rounded-full transition-all duration-200 ${
                      formik.errors.objective && formik.touched.objective
                        ? "border-red-500 text-red-500 animate-shake"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    Health concerns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`w-56 py-6 px-4 space-y-2 transition-all duration-200 ${
                    formik.errors.objective && formik.touched.objective
                      ? "border-red-500 text-red-500 animate-shake"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <Textarea
                    name="objective"
                    placeholder="Knee pain, fever, skin rash..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.objective}
                    className={`w-full border p-2 rounded-md transition-all duration-200 ${
                      formik.errors.objective && formik.touched.objective
                        ? "border-red-500 focus:ring-red-500 text-red-500 animate-shake"
                        : "border-gray-300 focus:ring-gray-400 text-gray-700"
                    }`}
                  />
                  {formik.errors.objective && formik.touched.objective && (
                    <div className="text-red-500 text-sm animate-shake">
                      {formik.errors.objective}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Max Wait */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    Max wait
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="md:w-36 py-6 px-4 space-y-2">
                  <RadioGroup
                    name="maxWait"
                    value={timeOfAppointment}
                    onValueChange={(value) => settimeOfAppointment(value)}
                    className="flex flex-col gap-4"
                  >
                    {timingOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2"
                      >
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Patient Availability (Horizontal Scroll on Mobile) */}
              <Select name="availability">
                <SelectTrigger className="md:w-auto w-full rounded-full">
                  <SelectValue placeholder="Patient availability" />
                </SelectTrigger>
                <SelectContent>
                  <RadioGroup
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                    className="flex flex-col gap-4"
                  >
                    {availabilityOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="custom" value="custom" />
                        <Label htmlFor="custom">Input your availability</Label>
                      </div>
                      {selectedOption === "custom" && (
                        <Textarea
                          placeholder="Free after 3pm on weekdays"
                          value={customAvailability}
                          onChange={(e) =>
                            setCustomAvailability(e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      )}
                    </div>
                  </RadioGroup>
                </SelectContent>
              </Select>

              {/* Insurance */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    Insurance
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 py-6 px-4 space-y-2">
                  <div className="space-y-2">
                    <Label>Member ID</Label>
                    <Input
                      name="subscriberId"
                      value={formik.values.subscriberId}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="space-y-2" style={{ marginBottom: "1rem" }}>
                    <Label>Insurer</Label>
                    <Select
                      name="insurer"
                      value={formik.values.insurer}
                      onValueChange={(value) => {
                        formik.setFieldValue("insurer", value);
                        setSelectedInsurance(false); //patient has insurance
                        setinsuranceType("PPO")
                      }}
                    >
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
                  <RadioGroup
                    name="insurance_type"
                    value={insuranceType}
                    onValueChange={(value) => setinsuranceType(value)}
                    className="flex flex-row gap-4"
                  >
                    {insurance_types.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2"
                      >
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label>Group Number(optional)</Label>
                    <Input
                      name="groupId"
                      value={formik.values.groupId}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="noInsurance"
                      checked={selectedInsurance}
                      onCheckedChange={(value) => setSelectedInsurance(value)}
                    />
                    <Label htmlFor="noInsurance">Don’t have insurance</Label>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              {/* <p className=" hidden md:block text-[#FF6723] mt-4 md:mt-0">
                Tip: You can re-arrange the priority by dragging list items
              </p> */}
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-[#FFF6F2] p-4 px-7 hidden md:block">
            <div className="flex items-center sm:gap-2">
              <p className="text-xs md:text-base">
                Docsure AI will call the following recommended doctors in this
                sequence and seek an appointment for you.
              </p>
              <Button
                type="button"
                onClick={handleFormSubmit}
                className="bg-[#FF6723] text-white md:p-5 p-4 md:ml-2"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <ScrollArea className="h-full md:w-full w-auto whitespace-nowrap">
          <Column
            activeCallIndex={activeCallIndex}
            tasks={doctors}
            onDelete={handleDelete}
            isDraggable={!isConfirmed}
            callStatus={callStatus}
            isAppointmentBooked={isAppointmentBooked}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext> */}
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <ScrollArea className="h-full w-full md:w-auto pb-14 md:pb-0">
          <div className="flex flex-col md:flex-row w-full">
            <Column
              activeCallIndex={activeCallIndex}
              tasks={doctors}
              onDelete={handleDelete}
              isDraggable={!isConfirmed}
              callStatus={callStatus}
              isAppointmentBooked={isAppointmentBooked}
            />
          </div>
        </ScrollArea>
      </DndContext>

      {/* Submit Section */}
      <div className="bg-[#FFF6F2] p-4 px-7 block md:hidden fixed bottom-0 left-0 w-full md:mt-12">
        <div className="flex items-center sm:gap-2">
          <p className="text-xs md:text-base">
            Docsure AI will call the following recommended doctors in this
            sequence and seek an appointment for you.
          </p>
          <Button
            type="button" // Prevents default form submission behavior since it's outside the form
            onClick={handleFormSubmit}
            className="bg-[#FF6723] text-white md:p-5 p-4 md:ml-2 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
}

// <form
//   onSubmit={formik.handleSubmit}
//   className="hidden md:flex w-full max-w-[50rem] border border-gray-600 rounded-none shadow-sm"
// >
//   <div className="flex flex-grow items-center w-full">
//     {/* Specialty section */}
//     <div className="flex items-center flex-1">
//       <div className="flex items-center justify-center px-3">
//         <Search className="w-5 h-5 text-gray-500" />
//       </div>
//       <div className="flex-1 min-w-[180px]">
//         <Autocomplete
//           id="specialty"
//           name="specialty"
//           className="w-full"
//           options={medicalSpecialtiesOptions}
//           placeholder="Medical specialty"
//           selected={specialty}
//           onChange={(value) => {
//             setSpecialty(value);
//             formik.setFieldValue("specialty", value);
//           }}
//           clearable={false}
//           navbar
//         />
//       </div>
//     </div>

//     {/* Location section */}
//     <div className="flex items-center flex-1">
//       <div className="flex items-center justify-center px-3">
//         <MapPin className="w-5 h-5 text-gray-500" />
//       </div>
//       <div className="flex-1">
//         {isLoaded && (
//           <StandaloneSearchBox
//             onLoad={(ref) => (inputRefs.current[0] = ref)}
//             onPlacesChanged={() => handleOnPlacesChanged(0)}
//           >
//             <Input
//               type="text"
//               placeholder="Address, city, zip code"
//               className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 shadow-none"
//               value={addressLocation || ""}
//               onChange={(e) => setAddressLocation(e.target.value)}
//               autoComplete="off"
//               aria-autocomplete="none"
//             />
//           </StandaloneSearchBox>
//         )}
//       </div>
//     </div>
//   </div>

//   {/* Search Button - Properly aligned */}
//   <Button className="bg-[#FF6723] text-white rounded-none h-12 px-6 flex-shrink-0">
//     <Search className="text-white w-5 h-5" />
//   </Button>
// </form>;

{
  /* <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    className={`rounded-full transition-all duration-200 ${
      formik.errors.objective && formik.touched.objective
        ? "border-red-500 text-red-500 animate-shake"
        : "border-gray-300 text-gray-700"
    }`}
  >
    Health concerns
  </Button>
</DropdownMenuTrigger>
<DropdownMenuContent
  className={`w-56 py-6 px-4 space-y-2 transition-all duration-200 ${
    formik.errors.objective && formik.touched.objective
      ? "border-red-500 text-red-500 animate-shake"
      : "border-gray-300 text-gray-700"
  }`}
>
  <Textarea
    name="objective"
    placeholder="Knee pain, fever, skin rash..."
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.objective}
    className={`w-full border p-2 rounded-md transition-all duration-200 ${
      formik.errors.objective && formik.touched.objective
        ? "border-red-500 focus:ring-red-500 text-red-500 animate-shake"
        : "border-gray-300 focus:ring-gray-400 text-gray-700"
    }`}
  />
  {formik.errors.objective && formik.touched.objective && (
    <div className="text-red-500 text-sm animate-shake">
      {formik.errors.objective}
    </div>
  )}
</DropdownMenuContent>
</DropdownMenu> */
}
