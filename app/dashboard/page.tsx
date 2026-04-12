"use client";

import { useEffect, useState } from "react";
import { observeAuth, getUserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Calendar, Clock, MapPin, Plus, Trash2, Edit, Ticket } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  price?: number;
  description?: string;
  capacity?: number;
  bookedSeats?: string[];
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
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

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

  const totalEvents = events.length;
  const totalBookings = events.reduce(
    (sum, event) => sum + (event.bookedSeats?.length || 0),
    0
  );

  if (loading) {
    return (
      <main className="mx-auto flex h-[50vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Organizer Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your events, view attendees, and create new experiences.
          </p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold !text-white shadow transition-all active:scale-[0.98] hover:bg-indigo-500"
        >
          <Plus size={20} />
          New Event
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Events</p>
          <h3 className="mt-2 text-4xl font-extrabold text-slate-900">
            {totalEvents}
          </h3>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Bookings</p>
          <h3 className="mt-2 text-4xl font-extrabold text-slate-900">
            {totalBookings}
          </h3>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">No events yet</h3>
          <p className="mb-6 text-slate-500">
            Create your first event to start accepting bookings.
          </p>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold !text-white shadow-sm transition hover:bg-indigo-700"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <h2 className="pr-4 text-xl font-bold leading-tight text-slate-900">
                  {event.title}
                </h2>

                {event.price && event.price > 0 && (
                  <span className="shrink-0 rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                    ${event.price}
                  </span>
                )}
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="rounded-lg bg-slate-50 p-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  {event.date}
                </div>

                {event.time && (
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="rounded-lg bg-slate-50 p-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    {event.time}
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="rounded-lg bg-slate-50 p-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                <Ticket className="h-4 w-4" />
                Bookings: {event.bookedSeats?.length || 0}
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6">
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Edit size={16} />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deletingId === event.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}