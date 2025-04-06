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
      <h2 className="text-2xl text-start mb-6 ml-4">Common health concerns</h2>

      {/* Accordions Side by Side */}
      <Accordion
        type="multiple"
        // collapsible
        className="w-full grid grid-cols-4 gap-4 accordion-mb"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Medical</AccordionTrigger>
          <AccordionContent>
            <ul className="pt-4 text-sm space-y-2 underline">
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() =>
                  onClickAction("OB-GYN (Obstetrician-Gynecologist)")
                }
              >
                Nexplanon removal
              </li>
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() =>
                  onClickAction("OB-GYN (Obstetrician-Gynecologist)")
                }
              >
                OB-GYN emergency
              </li>
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() =>
                  onClickAction("OB-GYN (Obstetrician-Gynecologist)")
                }
              >
                IUD removal
              </li>
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() =>
                  onClickAction("OB-GYN (Obstetrician-Gynecologist)")
                }
              >
                IUD insertion
              </li>
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() => onClickAction("Primary Care Physician")}
              >
                Annual physical
              </li>
              <li
                className="hover:underline hover:cursor-pointer"
                onClick={() => onClickAction("Primary Care Physician")}
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
                onClick={() =>
                  onClickAction("Endocrinologist / Diabetes Specialist")
                }
              >
                Ozempic / Wegovy Consultation
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Dental</AccordionTrigger>
          <AccordionContent>
            {/* <div> */}
            <ul className="pt-4 text-sm space-y-2 underline">
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
            {/* </div> */}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Mental Health</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 pt-4 text-sm underline">
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

        <AccordionItem value="item-4">
          <AccordionTrigger>Vision</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 pt-4 text-sm underline">
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
    </section>
  );
}
