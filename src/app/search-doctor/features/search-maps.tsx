// import React, { useState } from "react";
// import {
//   DistanceMatrixService,
//   GoogleMap,
//   Marker,
// } from "@react-google-maps/api";
// import { LoaderCircle } from "lucide-react";
// import { useGoogleMaps } from "@/providers/google-maps-provider"; // Import the provider hook

// export default function SearchMaps() {
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const containerStyle = {
//     width: "100%",
//     height: "100%", // Full height for the map container
//   };

//   const center = {
//     lat: 6.453056,
//     lng: 3.395833,
//   };

//   return (
//     <div className="h-screen w-full">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={12}
//         options={{ disableDefaultUI: true, zoomControl: true }}
//       >
//         {/* Add a Marker if a location is selected */}
//         {selectedLocation && (
//           <Marker position={selectedLocation} title="Selected Location" />
//         )}

//         {/* Add Distance Matrix Service */}
//         <DistanceMatrixService
//           options={{
//             origins: [{ lat: 6.453056, lng: 3.395833 }],
//             destinations: [{ lat: 6.5244, lng: 3.3792 }],
//             travelMode: "DRIVING",
//           }}
//           callback={(response) => {
//             console.log("Distance Matrix Response:", response);
//           }}
//         />
//       </GoogleMap>
//     </div>
//   );
// }
