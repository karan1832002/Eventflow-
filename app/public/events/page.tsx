import EventCard from "@/components/EventsCard";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function EventsPage() {
  const snap = await adminDb.collection("events").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Events</h1>
        <div className="grid grid-cols-3 gap-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </main>
    </>
  );
}