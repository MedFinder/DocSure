"use client";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Detect the current page
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils"; // Helper for conditional classes

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full border-b-2 border-gray-200 bg-white z-50">
      <div className="flex justify-between py-5 px-8 relative items-center">
        {/* Left Section: Logo & Search (only on Search Page) */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <span className="text-[#FF6723] font-semibold text-xl">DocSure</span>

          {/* Conditionally Show Search Bar on Search Page */}
          {pathname !== "/" && (
            <div className="hidden md:flex w-[38rem] border border-gray-400  overflow-hidden shadow-sm outline-none">
              {/* Search Icon */}

              {/* First Input */}
              <Input
                type="text"
                placeholder="Condition, procedure, doctor"
                className="w-full border-none focus:ring-0 focus:outline-none h-12 px-3 text-sm ml-1"
              />

              {/* Second Input */}
              <Input
                type="text"
                placeholder="Address, city, zip code"
                className="w-full border-none focus:ring-0 focus:outline-none h-12  text-sm"
              />

              {/* Search Button */}
              <Button className="bg-[#FF6723] text-white rounded-none px-6 h-12">
                <Search className="text-white w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-md font-normal">
          <Link href="/" className="hover:text-gray-500">
            Browse
          </Link>
          <Link href="/contact-us" className="hover:text-gray-500">
            Help
          </Link>
          <Link href="" className="hover:text-gray-500">
            Log In{" "}
          </Link>
          <Button className="bg-[#0074BA] rounded-none py-6">Sign Up</Button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="w-8 h-8 text-gray-700" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <span className="text-xl font-semibold text-[#FF6723]">DocSure</span>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-lg">
          <Link href="/" onClick={closeSidebar}>
            Browse
          </Link>
          <Link href="/contact-us" onClick={closeSidebar}>
            Help
          </Link>
          <Link href="" onClick={closeSidebar}>
            Log In
          </Link>
          <Button
            className="bg-[#0074BA] rounded-none w-full"
            onClick={closeSidebar}
          >
            Sign Up
          </Button>
        </nav>
      </div>

      {/* Overlay when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
