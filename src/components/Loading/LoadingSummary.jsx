// components/LoadingSummary.jsx
"use client";
import Lottie from "lottie-react";
import animationData from "../../../loading-summary.json"; // Adjust path as needed

const LoadingSummary = () => {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 100, height: 30 }}
    />
  );
};

export default LoadingSummary;