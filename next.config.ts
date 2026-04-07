import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://placehold.co/**"),
      new URL(
        "https://res.cloudinary.com/drcvunlct/image/upload/v1775494397/diinveed/users/**",
      ),
    ],
  },
};

export default nextConfig;
