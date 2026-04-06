import EventCard from "@/components/EventsCard";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function HomePage() {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Discover <span className="text-indigo-600">Extraordinary</span> Events
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Book seats for the best tech, design, and business events happening around you. Stay ahead of the curve.
        </p>
      </div>
      
      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 bg-white">
          No events available yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </main>
  );
}
