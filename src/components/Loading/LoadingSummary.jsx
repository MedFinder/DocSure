// components/LoadingSummary.jsx
"use client";
import Lottie from "lottie-react";
import animationData from "../../../loading-summary.json"; // Adjust path as needed

const LoadingSummary = ({ customstyle = { width: 100, height: 30,  } }) => {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ ...customstyle }} // Merge custom style props
    />
  );
};

export default LoadingSummary;
