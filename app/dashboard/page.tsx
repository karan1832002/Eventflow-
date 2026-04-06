"use client";

import { useEffect, useState } from "react";
import { observeAuth, getUserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Calendar, Clock, MapPin, Plus, Trash2, Edit } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  price?: number;
  description?: string;
  capacity?: number;
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
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
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
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organizer Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your events, view attendees, and create new experiences.</p>
        </div>
        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold !text-white shadow hover:bg-indigo-500 transition-all active:scale-[0.98]"
        >
          <Plus size={20} /> New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No events yet</h3>
          <p className="text-slate-500 mb-6">Create your first event to start accepting bookings.</p>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold !text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-900 leading-tight pr-4">{event.title}</h2>
                {event.price && event.price > 0 && (
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md shrink-0">
                    ${event.price}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <div className="p-1.5 bg-slate-50 rounded-lg"><Calendar className="w-4 h-4 text-slate-400" /></div>
                  {event.date}
                </div>
                {event.time && (
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <div className="p-1.5 bg-slate-50 rounded-lg"><Clock className="w-4 h-4 text-slate-400" /></div>
                    {event.time}
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <div className="p-1.5 bg-slate-50 rounded-lg"><MapPin className="w-4 h-4 text-slate-400" /></div>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  <Edit size={16} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition"
                >
                  <Trash2 size={16} /> {deletingId === event.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}