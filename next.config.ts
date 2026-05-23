import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sign-in",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
