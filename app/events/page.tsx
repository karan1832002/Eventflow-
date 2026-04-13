/**
 * app/events/page.tsx
 * 
 * Public page that displays all upcoming events.
 * It fetches event data from Firestore on the server and provides a searchable interface.
 */

import SearchBar from "@/components/SearchEvent";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * EventsPage Component (Server Component)
 * 
 * Fetches the global list of events and renders the search components.
 */
export default async function EventsPage() {
  // Fetch events using Admin SDK for server-side rendering
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header Section */}
      <div className="mb-10">
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
          Explore
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
          All Events
        </h1>
        <p className="text-lg text-slate-600 max-w-xl">
          Search and filter through all upcoming events and secure your booking today.
        </p>
      </div>

      {/* Reusable search/filter client component */}
      <SearchBar events={events}/>
    </main>
  );
}