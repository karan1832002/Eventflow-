import Navbar from "@/components/Navbar";
import BookingButton from "@/components/BookingButton";
import { adminDb } from "@/lib/firebaseAdmin";
import EventMap from "@/components/EventMap";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

export default async function EventDetails({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    throw new Error("Event not found");
  }

  const data = doc.data();
  if (!data) {
    throw new Error("Event data is missing");
  }

  const event: Event = {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="text-gray-600">{event.description}</p>
        <p className="text-sm text-gray-500">
          {event.date} • {event.time} • {event.location}
        </p>

        <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
          <EventMap location={event.location} />
        </div>

        <BookingButton eventId={event.id} />
      </main>
    </>
  );
}