import SearchBar from "@/components/SearchEvent";
import { adminDb } from "@/lib/firebaseAdmin";

// public events listing page — loads all events server-side before rendering
export default async function EventsPage() {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* page header */}
      <div className="mb-10">
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Explore</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">All Events</h1>
        <p className="text-lg text-slate-600 max-w-xl">
          Search and filter through all upcoming events and secure your booking today.
        </p>
      </div>

      {/* hands off to the client-side search component */}
      <SearchBar events={events} />
    </main>
  );
}