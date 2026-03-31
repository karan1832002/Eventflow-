import EventCard from "@/components/EventsCard";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function EventsPage() {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
          Discover Events
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
          All Events
        </h1>

        <p className="text-slate-600 mt-3 max-w-xl">
          Explore upcoming events, book seats, and enjoy amazing experiences.
        </p>
      </div>

      {/* Empty state */}
      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 bg-white">
          No events available yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </main>
  );
}