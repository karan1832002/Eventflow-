/**
 * components/BookingButton.tsx
 * 
 * A client-side button component that handles the booking process for an event.
 * Authenticates the user and sends a request to the booking API.
 */

"use client";

import { auth } from "@/lib/firebaseClient";

/**
 * BookingButton Component
 * 
 * @param {Object} props - Component props.
 * @param {string} props.eventId - The unique identifier of the event to book.
 */
export default function BookingButton({ eventId }: { eventId: string }) {
  /**
   * Handles the click event to initiate a booking.
   * Checks for authentication and submits the booking request.
   */
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