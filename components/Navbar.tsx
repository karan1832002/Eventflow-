"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole, logoutUser } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

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

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-3xl font-bold">
          EventFlow
        </Link>

        <nav className="flex items-center gap-3">
          {/* 👇 ONLY SHOW AFTER LOGIN */}
          {user && (
            <Link href="/events" className="px-4 py-2 hover:bg-gray-100 rounded">
              Events
            </Link>
          )}

          {/* 👇 ADMIN ONLY */}
          {user && role === "admin" && (
            <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
          )}

          {/* 👇 NOT LOGGED IN */}
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}