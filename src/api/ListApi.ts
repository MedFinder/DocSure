// import axios from "axios";

// export default async function handler(req: any, res: any) {
//   if (req.method === "POST") {
//     const { location, specialty } = req.body;
//     const { lat, lng } = location;

//     try {
//       const response = await axios.get(
//         "https://maps.googleapis.com/maps/api/place/textsearch/json",
//         {
//           params: {
//             key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
//             location: `${lat},${lng}`,
//             query: specialty,
//             radius: 2000, // Ensures better results
//           },
//         }
//       );

//       res.status(200).json(response.data.results.slice(0, 10));
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//       res.status(500).json({ error: "Error fetching doctors" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
