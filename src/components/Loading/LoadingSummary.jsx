// components/LoadingSummary.jsx
"use client";
import Lottie from "lottie-react";
import animationData from "/public/lottie/loading-summary"; // Adjust path as needed

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