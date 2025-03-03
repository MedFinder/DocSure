import React from "react";
import { LocationInfoProps } from "./types";

export const LocationInfo: React.FC<LocationInfoProps> = ({
  rating,
  reviews,
  distance,
  address,
  waitTime,
  appointments,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        <div className="self-start mt-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
            className="object-contain w-3 rounded-sm aspect-[1.09] max-md:mr-0.5"
            alt="Rating star"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/e1a10144632b09cb8fc1d0e08c86dc839fd917abf8e0a8a4813aeea16c85d804?placeholderIfAbsent=true"
            className="object-contain mt-1.5 w-4 aspect-square"
            alt="Location pin"
          />
        </div>
        <div className="flex-auto text-xs tracking-tight leading-5 text-zinc-800 w-[303px]">
          {rating} • {reviews} reviews
          <br />
          {distance} • {address}
        </div>
      </div>
      <p className="self-start text-xs tracking-tight text-zinc-800">
        {appointments} • {waitTime}
      </p>
    </div>
  );
};
