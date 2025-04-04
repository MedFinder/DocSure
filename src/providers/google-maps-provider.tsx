import React, { createContext, useContext, ReactNode, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

type GoogleMapsContextType = {
  isLoaded: boolean;
};

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(
  undefined
);

export const GoogleMapsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const googleMapsApiKey = "AIzaSyDd1e56OQkVXAJRUchOqHNJTGkCyrA2e3A";
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey={googleMapsApiKey}
        onLoad={() => setIsLoaded(true)} // Set isLoaded to true when the API is ready
      >
        {isLoaded ? children : <div>Loading Google Maps...</div>}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
