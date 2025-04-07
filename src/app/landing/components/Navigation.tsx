import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlignLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@vercel/analytics';

interface NavigationProps {
  scrollToSection: (id: string, offset: number) => void;
}

const Navigation = ({ scrollToSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#FCF8F1] shadow-sm p-4 flex justify-between items-center z-50 text-sm">
        <div className="flex justify-between items-center gap-6">
          <Image
            src="/web-new-logo.svg"
            alt="New Logo"
            width={150}
            height={40}
            className="w-28 h-auto hidden md:flex cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }}
          />
          <Image
            src="/mobile-new-logo.svg"
            alt="New Logo"
            width={40}
            height={40}
            className="w-auto h-auto block md:hidden cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }}
          />
          <div className="space-x-6 hidden md:block">
            <Link
              href="#"
              className="hover:text-[#E5573F]"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("doctors", 60);
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }}
            className="text-white bg-[#0074BA] rounded-md"
          >
            Get Started
          </Button>
        </div>

        <div className="md:hidden flex space-x-4">
          <Button 
            className="text-white bg-[#0074BA] rounded-md block md:hidden text-xs"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home", 40);
            }}
          >
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
            <button className="mb-4 flex" onClick={() => setIsOpen(false)}>
              <X size={24} /> <p className="text-[#E5573F] space-x-1"></p>
            </button>

            <nav className="flex flex-col space-y-4">
              <Link
                href="#"
                className="hover:text-[#E5573F]"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how_it_works", 60);
                  setIsOpen(false);
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
                  setIsOpen(false);
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
                  setIsOpen(false);
                }}
              >
                Insurance Plans
              </Link>
              <Link
                className="hover:text-[#E5573F]"
                onClick={() => {
                  track("Help_Btn_Clicked");
                  setIsOpen(false);
                }}
                href="/contact-us"
              >
                Help
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
