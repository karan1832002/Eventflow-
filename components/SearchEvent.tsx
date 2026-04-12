"use client";

import { useState } from "react";
import EventCard from "@/components/EventsCard";
import { EVENT_CATEGORIES } from "@/data/categories";

type SearchClientProps = {
  events: any[];
};

export default function SearchBar({ events }: SearchClientProps) {
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredEvents = events.filter((e) => {
    const query = searchString.trim().toLowerCase();

    let matchesSearch = true;
    let matchesCategory = true;

    if (query.startsWith("place:")) {
      const locationQuery = query.replace("place:", "").trim();
      matchesSearch = e.location.toLowerCase().includes(locationQuery);
    } else if (query.startsWith("date:")) {
      const dateQuery = query.replace("date:", "").trim();
      matchesSearch = e.date.includes(dateQuery);
    } else {
      matchesSearch =
        e.title.toLowerCase().includes(query) ||
        (e.description || "").toLowerCase().includes(query) ||
        (e.location || "").toLowerCase().includes(query);
    }

    if (selectedCategory) {
      matchesCategory = e.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <form
        className="mb-6 flex flex-col gap-3 md:flex-row"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search for an event..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Categories</option>
          {EVENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </form>

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No events found.
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