import localFont from "next/font/local";

export const athleticsFont = localFont({
  src: [
    {
      path: "../../public/athletics-font/Athletics Regular.otf",
      weight: "400",
    },

    {
      path: "../../public/athletics-font/Athletics Light.otf",
      weight: "300",
    },

    {
      path: "../../public/athletics-font/Athletics Medium.otf",
      weight: "500",
    },
    {
      path: "../../public/athletics-font/Athletics Bold.otf",
      weight: "700",
    },
    {
      path: "../../public/athletics-font/Athletics ExtraBold.otf",
      weight: "600",
    },
  ],
  variable: "--font-athletics",
});
