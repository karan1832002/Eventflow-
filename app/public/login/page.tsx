"use client";

import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (e: any) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form className="flex flex-col gap-3" onSubmit={login}>
          <input className="border p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </main>
    </>
  );
}