"use client";

import { useState } from "react";
import { EVENT_CATEGORIES } from "@/data/categories";

type EventFormProps = {
  initial?: any;
  onSubmit: (data: {
    title: string;
    category: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
    price: number;
  }) => void;
};

export default function EventForm({
  initial = {},
  onSubmit,
}: EventFormProps) {
  const [title, setTitle] = useState(initial.title || "");
  const [category, setCategory] = useState(initial.category || "");
  const [description, setDescription] = useState(initial.description || "");
  const [date, setDate] = useState(initial.date || "");
  const [time, setTime] = useState(initial.time || "");
  const [location, setLocation] = useState(initial.location || "");
  const [capacity, setCapacity] = useState(initial.capacity || 50);
  const [price, setPrice] = useState(initial.price || 0);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
        {initial.id ? "Edit Event" : "Event Details"}
      </h2>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            title,
            category,
            description,
            date,
            time,
            location,
            capacity: Number(capacity),
            price: Number(price),
          });
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Event Title
            </label>
            <input
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
              placeholder="e.g. Next.js Developer Conference"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 bg-white ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {EVENT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition min-h-[120px] resize-y"
              placeholder="Describe what the event is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Time
              </label>
              <input
                type="time"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Location
            </label>
            <input
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
              placeholder="e.g. San Francisco Convention Center"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                min="0"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Total Capacity
              </label>
              <input
                type="number"
                min="1"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold !text-white shadow hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
}