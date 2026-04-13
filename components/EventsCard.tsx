/**
 * components/EventsCard.tsx
 * 
 * A visually appealing card component that displays a summary of an event.
 * Includes title, description, date, time, and location with icons.
 */

import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

/**
 * EventCard Component
 * 
 * @param {Object} props - Component props.
 * @param {any} props.event - The event data object to display.
 */
export default function EventCard({ event }: { event: any }) {
  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      {/* Top visually appealing block (simulate an image container) */}
      <div className="h-40 bg-indigo-100/50 flex flex-col justify-end relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow-sm rounded-full px-3 py-1 text-xs font-bold text-slate-800">
          {event.price && event.price > 0 ? `$${event.price}` : "Free"}
        </div>
        <h3 className="relative z-10 text-xl font-bold tracking-tight text-white p-5 pb-4 line-clamp-2">
          {event.title}
        </h3>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-white">
        {/* Shortened description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 leading-relaxed">
          {event.description}
        </p>

        {/* Event Meta Data */}
        <div className="space-y-2.5 text-sm text-slate-600 mb-6 font-medium">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{event.date}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/events/${event.id}`}
          className="inline-flex w-full mt-2 items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold !text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}