"use client";

import { useEffect, useState } from "react";
import { observeAuth, getUserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  price?: number;
  description?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const loadEvents = async () => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    const data = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<EventItem, "id">),
    }));
    setEvents(data);
  };

  useEffect(() => {
    const unsub = observeAuth(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      if (role !== "admin") {
        router.push("/events");
        return;
      }

      await loadEvents();
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete event");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return <main className="p-6">Loading...</main>;
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Events</h1>
          <p className="mt-1 text-slate-600">Manage all created events.</p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No events created yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900">{event.title}</h2>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>📅 {event.date}</p>
                {event.time && <p>⏰ {event.time}</p>}
                <p>📍 {event.location}</p>
                {typeof event.price !== "undefined" && <p>💲 {event.price}</p>}
                {event.description && <p className="pt-1">{event.description}</p>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
                >
                  {deletingId === event.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}