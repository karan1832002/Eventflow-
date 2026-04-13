/**
 * app/page.tsx (HomePage)
 * 
 * The main landing page of the application.
 * Fetches events from Firestore on the server and passes them to the SearchBar for display.
 */

import SearchBar from "@/components/SearchEvent";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * HomePage Component (Server Component)
 * 
 * Fetches the list of all events, ordered by date, and renders the hero section and search interface.
 */
export default async function HomePage() {
  // Fetch events directly from Firestore using the Admin SDK (Server-side)
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Discover <span className="text-indigo-600">Extraordinary</span> Events
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Book seats for the best tech, design, and business events happening around you. Stay ahead of the curve.
        </p>
      </div>

       {/* Search interface - separated into a client component to handle state/interactivity */}
      <SearchBar events={events} />
    </main>
  );
}

