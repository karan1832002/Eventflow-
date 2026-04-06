"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Armchair, CheckCircle2 } from "lucide-react";

const ROWS = ["A", "B", "C"];
const COLS = [1, 2, 3, 4];

export default function BookingForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "events", eventId), (snap) => {
      if (snap.exists()) {
        setBookedSeats(snap.data().bookedSeats || []);
      }
    });
    return () => unsub();
  }, [eventId]);

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, email, seats: selectedSeats }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setSuccess(true);
      setSelectedSeats([]);
      setName("");
      setEmail("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Booking Confirmed!</h3>
        <p className="text-slate-600 leading-relaxed max-w-sm mb-4">
          Great! We've secured your seats and a confirmation email has been sent to your inbox.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-200 transition"
        >
          Book more seats
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm font-medium text-slate-600 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-50 ring-1 ring-inset ring-slate-200"></span> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/40"></span> Selected
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-300"></span> Booked
        </div>
      </div>

      {/* Screen Mock */}
      <div className="relative pt-6 mt-4 rounded-t-[100%] border-t-4 border-indigo-100 mx-8">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white px-4 text-[10px] font-bold tracking-[0.2em] text-slate-400">STAGE</span>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {ROWS.map((row) => (
          <div key={row} className="flex gap-4">
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
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300
                    ${
                      isBooked
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed opacity-70"
                        : isSelected
                        ? "bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 -translate-y-1"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:-translate-y-0.5 hover:shadow-md"
                    }
                  `}
                >
                  <Armchair size={24} className={isBooked && !isSelected ? "opacity-50" : ""} />
                  <span className="text-[10px] font-extrabold mt-1 tracking-wider">{seat}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-slate-100">
        <form onSubmit={handleBooking} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
            <input
              className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
            <input
              className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
              type="email"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || selectedSeats.length === 0}
            className="w-full mt-2 bg-indigo-600 !text-white py-4 px-4 rounded-xl font-bold shadow hover:bg-indigo-500 disabled:bg-slate-200 disabled:!text-slate-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : `Confirm Booking • ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
}