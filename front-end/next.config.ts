import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

   turbopack: {
    root: "/workspaces/petshop-backend-service", 
  },

};

export default nextConfig;
