import SearchBar from "@/components/SearchEvent";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function EventsPage() {
  const snap = await adminDb.collection("events").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Events</h1>
        <SearchBar events={events}/>
      </main>
    </>
  );
}