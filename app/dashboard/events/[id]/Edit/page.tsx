"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const ref = doc(db, "events", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Event not found");
          router.push("/dashboard");
          return;
        }

        const data = snap.data();
        setTitle(data.title || "");
        setLocation(data.location || "");
        setDate(data.date || "");
        setTime(data.time || "");
        setPrice(String(data.price ?? ""));
        setDescription(data.description || "");
      } catch (error) {
        console.error(error);
        alert("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadEvent();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, "events", id), {
        title,
        location,
        date,
        time,
        price: Number(price),
        description,
      });

      alert("Event updated successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading event...</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Edit Event</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <textarea
            className="min-h-[140px] w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              {saving ? "Saving..." : "Update Event"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}