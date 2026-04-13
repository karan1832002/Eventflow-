/**
 * app/public/events/[id]/page.tsx
 * 
 * An alternate/legacy dynamic page for viewing detailed event information.
 * Fetches specific event data and renders its description, metadata, and map.
 */

import Navbar from "@/components/Navbar";
import BookingButton from "@/components/BookingButton";
import { adminDb } from "@/lib/firebaseAdmin";
import EventMap from "@/components/EventMap";

/**
 * Event interface for the component state.
 */
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

/**
 * EventDetails Component (Server Component)
 * 
 * Fetches a single event by ID and displays its interactive details.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.params - Route parameters containing the event ID.
 */
export default async function EventDetails({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  // Retrieve event document from Firestore
  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    throw new Error("Event not found");
  }

  const data = doc.data();
  if (!data) {
    throw new Error("Event data is missing");
  }

  // Construct a type-safe event object
  const event: Event = {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="text-gray-600">{event.description}</p>
        <p className="text-sm text-gray-500">
          {event.date} • {event.time} • {event.location}
        </p>

        {/* Dynamic map component based on location string */}
        <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
          <EventMap location={event.location} />
        </div>

        {/* Booking action button */}
        <BookingButton eventId={event.id} />
      </main>
    </>
  );
}