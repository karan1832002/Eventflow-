import { adminDb } from "@/lib/firebaseAdmin";
import BookingForm from "@/components/BookingForm";
import EventMap from "@/components/EventMap";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category?: string;
  price?: number;
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Event Not Found
          </h2>
          <p className="text-slate-500 mt-2">
            The event you are looking for does not exist.
          </p>
        </div>
      </div>
    );
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
    category: data.category,
    price: data.price,
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* Left Column - Details */}
        <div className="space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-5">
              <Tag size={14} />
              {event.category || "General Event"}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              {event.title}
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-slate-100">
            <div className="flex flex-col gap-3 text-slate-700">
              <div className="p-3 bg-indigo-50 rounded-2xl w-max border border-indigo-100 text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Date</p>
                <p className="font-semibold text-slate-900">{event.date}</p>
              </div>
            </div>

            {event.time && (
              <div className="flex flex-col gap-3 text-slate-700">
                <div className="p-3 bg-indigo-50 rounded-2xl w-max border border-indigo-100 text-indigo-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Time</p>
                  <p className="font-semibold text-slate-900">{event.time}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 text-slate-700 col-span-2 sm:col-span-1">
              <div className="p-3 bg-indigo-50 rounded-2xl w-max border border-indigo-100 text-indigo-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Location</p>
                <p className="font-semibold text-slate-900">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
            <EventMap location={event.location} />
          </div>
        </div>

        {/* Right Column - Booking */}
        <div className="relative">
          <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Secure Seats
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select your preferred space
                </p>
              </div>

              <div className="text-right">
                <span className="text-4xl font-extrabold text-indigo-600">
                  {event.price && event.price > 0 ? `$${event.price}` : "Free"}
                </span>

                {event.price && event.price > 0 && (
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Per Seat
                  </p>
                )}
              </div>
            </div>

            <BookingForm eventId={event.id} />
          </div>
        </div>
      </div>
    </main>
  );
}