/**
 * components/Navbar.tsx
 * 
 * The main navigation bar for the application.
 * Handles user authentication state, navigation links based on user roles, and logout functionality.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole, logoutUser } from "@/lib/auth";

/**
 * Navbar Component
 * 
 * Renders a responsive header with navigation links and authentication controls.
 */
export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  /**
   * Monitor authentication state changes and fetch user roles.
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const r = await getUserRole(u.uid);
        setRole(r);
      } else {
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          EventFlow
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3">
          {/* Only shown when user is logged in */}
          {user && (
            <Link href="/events" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Events
            </Link>
          )}

          {/* Admin Dashboard link (organizer only) */}
          {user && role === "admin" && (
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
          )}

          {/* Authentication Actions */}
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-sm hover:bg-indigo-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Profile/Bookings link (non-admins) */}
              {role !== "admin" && (
                <Link href="/profile" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  My Bookings
                </Link>
              )}
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
              >
                Log out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}