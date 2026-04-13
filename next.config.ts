/**
 * next.config.ts
 * 
 * Main configuration file for Next.js.
 * Configures framework-level features like Turbopack and path resolution.
 */

import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration for fast development builds
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

