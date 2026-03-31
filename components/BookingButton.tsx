"use client";

import { auth } from "@/lib/firebaseClient";

export default function BookingButton({ eventId }: { eventId: string }) {
  const handleBook = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login first");

    const token = await user.getIdToken();

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) alert("Booking confirmed");
    else alert("Booking failed");
  };

  return (
    <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded">
      Book this event
    </button>
  );
}