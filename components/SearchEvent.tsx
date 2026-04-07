'use client';

import { useState } from "react";
import EventCard from "@/components/EventsCard";

type SearchClientProps = {
  events: any[];
};

export default function SearchBar({ events }: SearchClientProps) {
  const [searchString, setSearchString] = useState("");

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <>
      <form className="flex gap-2 m-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search..."
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </form>

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 bg-white">
          No matching events.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </>
  );
}