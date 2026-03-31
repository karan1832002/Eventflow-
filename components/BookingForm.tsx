"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Armchair } from "lucide-react";

const ROWS = ["A", "B", "C"];
const COLS = [1, 2, 3, 4];

export default function BookingForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔴 REAL-TIME SEATS
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "events", eventId), (snap) => {
      if (snap.exists()) {
        setBookedSeats(snap.data().bookedSeats || []);
      }
    });

    return () => unsub();
  }, [eventId]);

  // 🎯 SELECT SEAT
  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  // 🎟️ BOOKING
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      alert("Please select seats");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          name,
          email,
          seats: selectedSeats,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      alert("Booking successful 🎉");

      setSelectedSeats([]);
      setName("");
      setEmail("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🎬 Select Your Seats</h2>

      {/* 🎨 LEGEND */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border"></div> Available
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500"></div> Selected
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-400"></div> Booked
        </div>
      </div>

      {/* 🎬 SCREEN */}
      <div className="text-center mb-2">
        <div className="bg-gray-300 py-1 rounded w-2/3 mx-auto">
          SCREEN
        </div>
      </div>

      {/* 🪑 SEAT GRID */}
      <div className="flex flex-col items-center gap-3">
        {ROWS.map((row) => (
          <div key={row} className="flex gap-3">
            {COLS.map((col) => {
              const seat = `${row}${col}`;
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  type="button"
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  className={`flex flex-col items-center p-2 rounded transition
                    ${isBooked ? "bg-gray-400 cursor-not-allowed" : ""}
                    ${isSelected ? "bg-green-500 text-white" : "border"}
                  `}
                >
                  <Armchair size={20} />
                  <span className="text-xs">{seat}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ✍️ FORM */}
      <form onSubmit={handleBooking} className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border p-3 rounded"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Booking..." : "Book Selected Seats"}
        </button>
      </form>
    </div>
  );
}