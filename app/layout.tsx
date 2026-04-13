// root layout — wraps every page with the navbar and global styles

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div className="flex-1 w-full">{children}</div>
      </body>
    </html>
  );
}