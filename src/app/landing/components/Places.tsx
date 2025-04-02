"use client";
import * as React from "react";

interface LocationItemProps {
  name: string;
  onClick: () => void;
  addressLocation: string | null;
}

const LocationItem: React.FC<LocationItemProps> = ({ name, onClick, addressLocation }) => {
  return (
    <li
      className={`px-3 py-4 text-sm tracking-tight text-black rounded-lg bg-[#EFEADE] text-center cursor-pointer ${
        addressLocation === name
          ? "bg-slate-800 text-white" // Selected state
          : "hover:text-white hover:bg-slate-800" // Normal state
      } `}
      onClick={onClick}
    >
      {name}
    </li>
  );
};

interface LocationColumnProps {
  locations: string[];
  onLocationClick: (location: string) => void;
  addressLocation: string | null;
}

const LocationColumn: React.FC<LocationColumnProps> = ({ locations, onLocationClick, addressLocation }) => {
  return (
    <ul className="flex flex-col gap-3 w-[200px] max-md:w-[calc(50%-8px)] max-sm:w-full">
      {locations.map((location, index) => (
        <LocationItem
          key={`${location}-${index}`}
          name={location}
          onClick={() => onLocationClick(location)}
          addressLocation={addressLocation}
        />
      ))}
    </ul>
  );
};

interface PlacesProps {
  PrefillLocation: (location: string) => void;
  addressLocation: string | null;
}

const Places: React.FC<PlacesProps> = ({ PrefillLocation, addressLocation }) => {
  const locations1 = [
    "Charlotte, North Carolina",
    "Chicago, Illinois",
    "Columbus, Ohio",
    "Dallas, Texas",
    "Denver, Colorado",
  ];
  const locations2 = [
    "Fort Worth, Texas",
    "Houston, Texas",
    "Indianapolis, Indiana",
    "Jacksonville, Florida",
    "Los Angeles, California",
  ];
  const locations3 = [
    "New York City, New York",
    "Philadelphia, Pennsylvania",
    "Phoenix, Arizona",
    "San Antonio, Texas",
    "San Diego, California",
  ];
  const locations4 = [
    "San Francisco, California",
    "San Jose, California",
    "Phoenix, Arizona",
    "Seattle, Washington",
    "Washington, D.C.",
  ];

  return (
    <section className="md:flex flex-wrap md:gap-4 justify-center p-5 mx-auto my-0 md:max-w-[1200px] max-md:max-w-[991px] max-sm:w-full max-sm:px-8 grid grid-cols-2 gap-4">
      <LocationColumn locations={locations1} onLocationClick={PrefillLocation} addressLocation = {addressLocation} />
      <LocationColumn locations={locations2} onLocationClick={PrefillLocation} addressLocation = {addressLocation} />
      <LocationColumn locations={locations3} onLocationClick={PrefillLocation} addressLocation = {addressLocation} />
      <LocationColumn locations={locations4} onLocationClick={PrefillLocation} addressLocation = {addressLocation} />
    </section>
  );
};

export default Places;
