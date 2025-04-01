"use client";
import * as React from "react";

interface LocationItemProps {
  name: string;
}

const LocationItem: React.FC<LocationItemProps> = ({ name }) => {
  return (
    <li className="px-3 py-4 text-sm tracking-tight text-black rounded-lg bg-[#EFEADE] text-center">
      {name}
    </li>
  );
};

interface LocationColumnProps {
  locations: string[];
}

const LocationColumn: React.FC<LocationColumnProps> = ({ locations }) => {
  return (
    <ul className="flex flex-col gap-3 w-[200px] max-md:w-[calc(50%-8px)] max-sm:w-full">
      {locations.map((location, index) => (
        <LocationItem key={`${location}-${index}`} name={location} />
      ))}
    </ul>
  );
};

const Places: React.FC = () => {
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
      <LocationColumn locations={locations1} />
      <LocationColumn locations={locations2} />
      <LocationColumn locations={locations3} />
      <LocationColumn locations={locations4} />
    </section>
  );
};

export default Places;
