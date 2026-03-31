"use client";

import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("attendee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const register = async (e: any) => {
    e.preventDefault();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    });
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <form className="flex flex-col gap-3" onSubmit={register}>
          <input className="border p-2" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <select className="border p-2" onChange={(e) => setRole(e.target.value)}>
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
          <input className="border p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white p-2 rounded">Sign up</button>
        </form>
      </main>
    </>
  );
}