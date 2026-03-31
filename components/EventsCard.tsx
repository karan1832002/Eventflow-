import Link from "next/link";
import { Event } from "@/lib/types";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      
      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 line-clamp-2">
        {event.description}
      </p>

      {/* Meta info */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>📅 {event.date}</p>
        <p>⏰ {event.time}</p>
        <p>📍 {event.location}</p>
      </div>

      {/* Button */}
      <Link
        href={`/events/${event.id}`}
        className="inline-block mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-indigo-700"
      >
        View Details →
      </Link>
    </div>
  );
}