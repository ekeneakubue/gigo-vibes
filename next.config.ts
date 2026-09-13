import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lock Turbopack to this app — a package-lock.json under C:\Users\Ege Work
  // otherwise gets treated as the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
