// root layout — every page in the app goes through here
// sets up the font, global styles, and the shared navbar

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// load Inter and expose it as a CSS variable for Tailwind
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        {/* page content fills the remaining space */}
        <div className="flex-1 w-full">{children}</div>
      </body>
    </html>
  );
}