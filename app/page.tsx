// Home page - fetches all events on the server and shows a search interface

import SearchBar from "@/components/SearchEvent";
import { adminDb } from "@/lib/firebaseAdmin";

// Runs on the server: loads events from the database before the page is sent to the browser
export default async function HomePage() {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero heading */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Discover <span className="text-indigo-600">Extraordinary</span> Events
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Book seats for the best tech, design, and business events happening around you. Stay ahead of the curve.
        </p>
      </div>

      {/* Search and filter - runs in the browser to handle user input */}
      <SearchBar events={events} />
    </main>
  );
}

