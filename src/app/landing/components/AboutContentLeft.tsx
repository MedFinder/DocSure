"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styled from "styled-components";

const ContentLeftWrapper = styled.div`
  margin-bottom: 5rem;

  &:last-child {
    margin-bottom: 0px;
  }
  .about_content_right-42 {
    width: 42%;
  }

  .about_content_right-42 .img_text-overflow {
    top: 5rem;
    max-width: 40%;
    left: 1rem;
  }
  .about_content_left-50 {
    width: 50%;
  }

  .about_wrapper_inner {
    display: flex;
    transform: translate3d(0px, 0px, 0px);
  }
    
  .about_content_right-42 .about_content_wrap {
    // margin-left: auto;
    margin-right: auto;
    max-width: 350px;
  }

  .doc-smiling_img {
    height: 115%;
    object-fit: fill;
  }

  @media only screen and (min-width: 992px) and (max-width: 1024px) {
    .about_content_right-42 .about_content_wrap {
      max-width: 368px;
    }
    .doc-smiling_img {
      height: 110%;
      object-fit: cover;
      top: -10%;
    }
  }

  @media only screen and (max-width: 991px) {
    .about_wrapper_inner {
      flex-wrap: wrap;
      flex-direction: column;
    }

    .mobile-reverse {
      flex-direction: column-reverse;
    }

    .about_content_right-42,
    .about_content_left-50 {
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
    .about_content_right-42 .img_text-overflow {
      top: 4rem;
      max-width: 42%;
      left: 1rem;
    }
    .doc-smiling_img {
      position: absolute;
      top: -10%;
      height: 110%;
    }
  }
`;

interface ContentRightProps {
  insuranceLeftLogos?: [
    {
      src: string;
      alt: string;
      carrier: string;
      width?: number;
      height?: number;
    }
  ];
  scrollToSection: (a: string, b: number) => void;
  title: string;
  subtitle?: string;
  ImgDisplayFor: string;
}

const AboutContentLeft: React.FC<ContentRightProps> = ({
  insuranceLeftLogos,
  scrollToSection,
  title,
  subtitle,
  ImgDisplayFor,
}) => {
  return (
    <ContentLeftWrapper>
      <div className="about_wrapper_inner flex justify-between items-center mobile-reverse">
        <div className="about_content_right-42">
          <div className="about_content_wrap">
            <p className="text-3xl mb-4">{title}</p>
            {/* Find doctors in any insurance network */}

            {insuranceLeftLogos ? (
              <div className="flex flex-wrap gap-4">
                {insuranceLeftLogos?.map((logo, index) => (
                  <Image
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo?.width ?? 0}
                    height={logo?.height ?? 0}
                    className="w-auto h-auto md:flex"
                  />
                ))}
              </div>
            ) : null}
            {subtitle ? <span className="">{subtitle}</span> : null}

            <Link
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home", 40);
              }}
              href=""
              className=" text-[#E5573F] flex gap-1 pt-12 hover:text-black"
            >
              Get Started <ArrowRight />
            </Link>
          </div>
        </div>

        {/* <Component /> */}
        {ImgDisplayFor === "InsuranceNetwork" ? (
          <div className="about_content_left-50">
            <div className="bg-[#e5573f] img-bg rounded-2xl relative flex items-center justify-between h-80">
              <div className="relative justify-start bottom-6 left-6 z-10 flex flex-col text-left gap-2 bg-opacity-50 ">
                <p className="text-white text-3xl  leading-tight w-[100%]">
                  Over 1M doctors
                </p>
                <p className="text-white w-[100%]">
                  Largest selection of providers across
                </p>
              </div>

              {/* Right Content - Images */}
              <div className="relative h-full flex  justify-end w-[100%] doc-smiling_img_wrap">
                <Image
                  src="/smiling-doc-Mask.svg"
                  alt="Background Decoration"
                  layout="fill"
                  objectFit="cover"
                  className="relative top-0 left-0 w-full h-full rounded-lg"
                />

                {/* Foreground Group 167 - Full Height */}
                <Image
                  src="/doc-smiling-face.svg"
                  alt="Doctor Illustration"
                  // width={300}
                  // height={800}
                  width={400}
                  height={800}
                  className="doc-smiling_img md:absolute h-full md:-top-[15%]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="about_content_left-50">
            <div className="bg-[#2CA07F] img-bg rounded-2xl relative flex items-center justify-between h-80 overflow-hidden">
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
                  height={600}
                  className="relative h-full object-cover ml-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLeftWrapper>
  );
};

export default AboutContentLeft;
