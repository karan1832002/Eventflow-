/**
 * app/layout.tsx
 * 
 * The root layout component for the entire application.
 * Defines the HTML structure, loads global fonts, and includes shared components like the Navbar.
 */

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Load Inter font with a CSS variable for Tailwind integration
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * RootLayout Component
 * 
 * Wraps every page in the application.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The specific page content to render.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div className="flex-1 w-full">{children}</div>
      </body>
    </html>
  );
}