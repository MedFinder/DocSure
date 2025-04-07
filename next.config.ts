import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true, // Enables SWC support for styled-components
  },
};

export default nextConfig;
