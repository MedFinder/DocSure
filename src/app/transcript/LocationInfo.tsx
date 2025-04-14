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
    <div className="flex  ">
      <div className="flex gap-1">
        <div className="mt-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/b0f5fa409dd54a5f57c16e94df238e3e2d3efae03a4fe0431e6a27269654a1a1?placeholderIfAbsent=true"
            className=""
            alt="Rating star"
          />
        </div>
        <div className="flex text-sm tracking-tight leading-5 text-zinc-800 w-[150px] gap-1 ">
          {rating} •<span className=""> {reviews} reviews</span>
        </div>
        <div className="flex gap-1 items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/1fce0463b354425a961fa14453bc1061/e1a10144632b09cb8fc1d0e08c86dc839fd917abf8e0a8a4813aeea16c85d804?placeholderIfAbsent=true"
            className=""
            alt="Location pin"
          />

          <span className="text-sm tracking-tight leading-5 text-zinc-800 w-auto min-w-[60px] max-w-[200px]">
            {distance}
          </span>
        </div>
      </div>
    </div>
  );
};
