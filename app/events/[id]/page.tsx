import { adminDb } from "@/lib/firebaseAdmin";
import BookingForm from "@/components/BookingForm";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    return <div className="p-6">Event not found</div>;
  }

  const event = { id: doc.id, ...doc.data() } as any;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-3 text-3xl font-bold">{event.title}</h1>
      <p className="mb-2">{event.location}</p>
      <p className="mb-2">{event.date}</p>
      <p className="mb-4">Price: ${event.price}</p>
      <p className="mb-8">{event.description}</p>

      <BookingForm eventId={event.id} />
    </div>
  );
}