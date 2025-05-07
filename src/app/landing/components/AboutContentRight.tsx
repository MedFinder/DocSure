"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styled from "styled-components";

const ContentRightWrapper = styled.div`
  margin-bottom: 5rem;

  .about_content_right-42 {
    width: 42%;
  }
  .about_content_left-54 {
    width: 470px;
  }

  .about_wrapper_inner {
    display: flex;
    transform: translate3d(0px, 0px, 0px);
  }
  .about_content_right-42 .about_content_wrap {
    margin-right: auto;
  }

  @media only screen and (max-width: 991px) {
    .about_wrapper_inner {
      flex-wrap: wrap;
    }

    .about_content_right-42,
    .about_content_left-54 {
      width: 100%;
    }

    .about_content_wrap {
      margin-left: auto;
      margin-right: auto;
      max-width: 400px !important;
      margin-top: 1.3rem;
    }

    .img-bg {
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

interface ContentRightProps {
  insuranceRightLogos?: [
    {
      src: string;
      alt: string;
      carrier: string;
      width?: number;
      height?: number;
      insurance?: string;
    }
  ];
  scrollToSection: (a: string, b: number) => void;
  updateprefillAvailability: (specialty?: string, insurance?: string) => void;
  title: string;
  subtitle?: string;
  Component?: React.ComponentType<any>;
  ImgDisplayFor?: string;
}

const AboutContentLeft: React.FC<ContentRightProps> = ({
  insuranceRightLogos,
  scrollToSection,
  updateprefillAvailability,
  title,
  subtitle,
}) => {
  return (
    <ContentRightWrapper>
      <div className="about_wrapper_inner flex justify-between items-center">
        <div className="about_content_left-54">
          <div className="bg-[#0074BA] rounded-2xl relative img-bg flex justify-between items-center h-80">
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
                  <Image src="/Star 7.svg" alt="Star" width={20} height={20} />
                  <Image src="/Star 7.svg" alt="Star" width={20} height={20} />
                  <Image src="/Star 7.svg" alt="Star" width={20} height={20} />
                </div>

                {/* Bottom 2 Stars */}
                <div className="flex gap-4 mt-2">
                  <Image src="/Star 7.svg" alt="Star" width={20} height={20} />
                  <Image src="/Star 7.svg" alt="Star" width={20} height={20} />
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
                className="relative h-full object-fill"
              />
            </div>
          </div>
        </div>

        <div className="about_content_right-42 md:ml-8">
          <div className="about_content_wrap">
            <p className="text-3xl mb-4">{title}</p>

            {insuranceRightLogos ? (
              <div className="flex flex-wrap gap-4">
                {insuranceRightLogos?.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    onClick={()=>updateprefillAvailability && updateprefillAvailability("", logo.insurance )}
                    className="w-auto h-auto md:flex hover:cursor-pointer"
                  />
                ))}
              </div>
            ) : null}
            {subtitle ? (
              <p className="text-lg content_wrap-sub_text">{subtitle}</p>
            ) : null}

            <Link
              onClick={(e) => {
                e.preventDefault();
                // scrollToSection("home", 40);
                updateprefillAvailability &&
                  updateprefillAvailability();
              }}
              href=""
              className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
            >
              Get Started <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </ContentRightWrapper>
  );
};

export default AboutContentLeft;
