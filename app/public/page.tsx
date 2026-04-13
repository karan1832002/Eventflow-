/**
 * app/public/page.tsx
 * 
 * An alternate/legacy public home page.
 * Displays a list of upcoming events fetched from Firestore.
 */

import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventsCard";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * HomePage Component (Server Component)
 * 
 * Fetches and displays a grid of events.
 */
export default async function HomePage() {
  const snap = await adminDb.collection("events").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
        <div className="grid grid-cols-3 gap-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </main>
    </>
  );
}