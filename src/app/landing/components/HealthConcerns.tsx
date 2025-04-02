"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface HealthConcernsProps {
  onClickAction: (value: string) => void;
}

export default function HealthConcerns({ onClickAction }: HealthConcernsProps) {
  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl text-start mb-6">Common health concerns</h2>

      {/* Accordions Side by Side */}
      <div className="grid grid-cols-4 gap-4">
        {/* Medical - Open by default */}
        <Accordion type="single" defaultValue="medical" collapsible>
          <AccordionItem value="medical">
            <AccordionTrigger className="text-base font-medium">
              Medical
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("OB-GYN (Obstetrician-Gynecologist)")}
                >
                  Nexplanon removal
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("OB-GYN (Obstetrician-Gynecologist)")}
                >
                  OB-GYN emergency
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("OB-GYN (Obstetrician-Gynecologist)")}
                >
                  IUD removal
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("OB-GYN (Obstetrician-Gynecologist)")}
                >
                  IUD insertion
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Primary Care Physician (PCP) / Family Practice Physician")}
                >
                  Annual physical
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Primary Care Physician (PCP) / Family Practice Physician")}
                >
                  COVID-19 testing
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Dermatologist")}
                >
                  Hair loss
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Endocrinologist / Diabetes Specialist")}
                >
                  Ozempic / Wegovy Consultation
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Dental - Closed by Default */}
        <Accordion type="single" collapsible>
          <AccordionItem value="dental">
            <AccordionTrigger className="text-base font-medium">
              Dental
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Dentist")}
                >
                  Teeth cleaning
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Dentist")}
                >
                  Cavity filling
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Dentist")}
                >
                  Tooth extraction
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Cosmetic Dentist")}
                >
                  Braces consultation
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Mental Health - Closed by Default */}
        <Accordion type="single" collapsible>
          <AccordionItem value="mental-health">
            <AccordionTrigger className="text-base font-medium">
              Mental Health
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Therapist / Counselor")}
                >
                  Therapy sessions
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Therapist / Counselor")}
                >
                  Depression counseling
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Therapist / Counselor")}
                >
                  Anxiety management
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Psychiatrist")}
                >
                  Psychiatrist consultation
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Vision - Closed by Default */}
        <Accordion type="single" collapsible>
          <AccordionItem value="vision">
            <AccordionTrigger className="text-base font-medium">
              Vision
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Ophthalmologist")}
                >
                  Eye exam
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Optometrist")}
                >
                  Contact lens fitting
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Ophthalmologist")}
                >
                  LASIK consultation
                </li>
                <li
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => onClickAction("Optometrist")}
                >
                  Glasses prescription
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
