import EventCard from "@/components/EventsCard";
import SearchBar from "@/components/SearchBar";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function HomePage() {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
        
        <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
        <SearchBar/> 
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </main>
    </>
  );
}
