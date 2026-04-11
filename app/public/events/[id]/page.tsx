import Navbar from "@/components/Navbar";
import BookingButton from "@/components/BookingButton";
import { adminDb } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";

export default async function EventDetails({ params }: { params: { id: string } }) {
  const id = params?.id;

  if (!id) {
    notFound();
  }

  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    notFound();
  }

  const event = { id: doc.id, ...(doc.data() as any) };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="text-gray-600">{event.description}</p>
        <p className="text-sm text-gray-500">
          {event.date} • {event.time} • {event.location}
        </p>

        <BookingButton eventId={event.id} />
      </main>
    </>
  );
}