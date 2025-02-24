import localFont from "next/font/local";

export const lexendFont = localFont({
  src: [
    {
      path: "../../public/lexend-font/Lexend-Regular.ttf",
      weight: "400",
      style: "normal",
    },

    {
      path: "../../public/lexend-font/Lexend-Medium.ttf",
      weight: "500",
      style: "italic",
    },

    {
      path: "../../public/lexend-font/Lexend-SemiBold.ttf",
      weight: "600",
      style: "semibold",
    },
    {
      path: "../../public/lexend-font/Lexend-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/lexend-font/Lexend-ExtraBold.ttf",
      weight: "800",
      style: "extrabold",
    },
  ],
});
