"use client";

import { useState } from "react";

export default function EventForm({ initial = {}, onSubmit }: any) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [date, setDate] = useState(initial.date || "");
  const [time, setTime] = useState(initial.time || "");
  const [location, setLocation] = useState(initial.location || "");
  const [capacity, setCapacity] = useState(initial.capacity || 50);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, description, date, time, location, capacity });
      }}
    >
      <input className="border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" className="border p-2" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" className="border p-2" value={time} onChange={(e) => setTime(e.target.value)} />
      <input className="border p-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="number" className="border p-2" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />

      <button className="bg-blue-600 text-white p-2 rounded">Save</button>
    </form>
  );
}