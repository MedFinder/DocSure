import React from "react";

const LocationPin: React.FC = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="location-pin"
    >
      <path
        d="M13 8C13 11.2093 9.63256 13.4165 8.42475 14.105C8.15889 14.2565 7.84111 14.2565 7.57526 14.105C6.36745 13.4165 3 11.2093 3 8C3 5 5.42267 3 8 3C10.6667 3 13 5 13 8Z"
        stroke="#222222"
      />
      <circle cx="7.99998" cy="7.99967" r="2.16667" stroke="#222222" />
    </svg>
  );
};

export default LocationPin;
