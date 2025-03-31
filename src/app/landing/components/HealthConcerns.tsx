"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HealthConcerns() {
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
                <li>Nexplanon removal</li>
                <li>OB-GYN emergency</li>
                <li>IUD removal</li>
                <li>IUD insertion</li>
                <li>Annual physical</li>
                <li>COVID-19 testing</li>
                <li>Online doctors</li>
                <li>Hair loss</li>
                <li>Ozempic / Wegovy Consultation</li>
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
                <li>Teeth cleaning</li>
                <li>Cavity filling</li>
                <li>Tooth extraction</li>
                <li>Braces consultation</li>
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
                <li>Therapy sessions</li>
                <li>Depression counseling</li>
                <li>Anxiety management</li>
                <li>Psychiatrist consultation</li>
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
                <li>Eye exam</li>
                <li>Contact lens fitting</li>
                <li>LASIK consultation</li>
                <li>Glasses prescription</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
