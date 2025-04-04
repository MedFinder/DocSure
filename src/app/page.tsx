"use client";
import React from "react";
import HomeScreen from "./home/page";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";

export default function Home() {
  return (
    <div>
      <HomeScreen />
    </div>
  );
}
