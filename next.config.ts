import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: false },
      { source: "/script", destination: "/", permanent: false },
      { source: "/credits", destination: "/", permanent: false },
      { source: "/sets", destination: "/", permanent: false },
      { source: "/lyrics", destination: "/", permanent: false },
      {
        source: "/characters",
        destination: "/",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
