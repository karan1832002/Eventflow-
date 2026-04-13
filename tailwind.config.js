/**
 * tailwind.config.js
 * 
 * Configuration for Tailwind CSS.
 * Defines content paths for purging unused styles and custom theme extensions.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify paths to all files that contain Tailwind class names
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions (colors, fonts, etc.) can be added here
    },
  },
  plugins: [], // Any Tailwind plugins would be listed here
};