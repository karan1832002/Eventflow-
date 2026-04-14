"use client";

import { useEffect, useState } from "react";
import { observeAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where, documentId, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";

// types for the data we're working with
type Booking = { id: string; eventId: string; seats: string[]; createdAt: string };
type EventItem = { id: string; title: string; date: string; location: string };

// profile page — shows the logged-in user's email and all their bookings
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<(Booking & { event?: EventItem })[]>([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  useEffect(() => {
    const unsub = observeAuth(async (u) => {
      // not logged in — kick them to the login page
      if (!u) { router.push("/login"); return; }
=======
  /**
   * This effect runs when the page loads. 
   * It checks if you are logged in and then listens for your bookings in real-time.
   */
  useEffect(() => {
    // Variable to hold the listener for bookings so we can stop it later
    let unsubBookings: () => void;

    // Watch for login state changes
    const unsubAuth = observeAuth(async (u) => {
      // If no user is logged in, send them to the login page
      if (!u) {
        router.push("/login");
        return;
      }
      
      // Save the user data
>>>>>>> 19b5819a5a5fb3be15ece635a44c4aa2fcb8d07b
      setUser(u);

      try {
<<<<<<< HEAD
        // get all bookings that belong to this user
        const qBookings = query(collection(db, "bookings"), where("email", "==", u.email));
        const snapBookings = await getDocs(qBookings);
        const userBookings = snapBookings.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];

        if (userBookings.length === 0) { setBookings([]); setLoading(false); return; }

        // collect unique event IDs then fetch their details in a single query
        const eventIds = Array.from(new Set(userBookings.map(b => b.eventId)));
        const snapEvents = await getDocs(
          query(collection(db, "events"), where(documentId(), "in", eventIds.slice(0, 10)))
        );

        // build a map so we can look up events by ID quickly
        const eventsMap = new Map();
        snapEvents.forEach(doc => eventsMap.set(doc.id, { id: doc.id, ...doc.data() }));

        // attach the event info to each booking
        setBookings(userBookings.map(b => ({ ...b, event: eventsMap.get(b.eventId) })));
=======
        // Create a query to find all bookings that belong to this user's email
        const qBookings = query(collection(db, "bookings"), where("email", "==", u.email));
        
        // Start listening for any changes to your bookings (real-time)
        unsubBookings = onSnapshot(qBookings, async (snapBookings) => {
          // Map the database documents into a list of booking objects
          const userBookings = snapBookings.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[];

          // If there are no bookings, stop here and show the empty state
          if (userBookings.length === 0) {
            setBookings([]);
            setLoading(false);
            return;
          }

          // Get a list of unique event IDs from the user's bookings
          const eventIds = Array.from(new Set(userBookings.map(b => b.eventId)));
          
          // Fetch the details (title, date, location) for each event.
          // We can fetch up to 30 events at once using the 'in' operator.
          const qEvents = query(collection(db, "events"), where(documentId(), "in", eventIds.slice(0, 30)));
          const snapEvents = await getDocs(qEvents);
          
          // Create a map to quickly look up event details by their ID
          const eventsMap = new Map();
          snapEvents.forEach(doc => {
            eventsMap.set(doc.id, { id: doc.id, ...doc.data() });
          });

          // Combine the booking data with the event information
          const merged = userBookings.map(b => ({
            ...b,
            event: eventsMap.get(b.eventId)
          }));

          // Update the state to show the list on the page
          setBookings(merged);
          setLoading(false);
        });
>>>>>>> 19b5819a5a5fb3be15ece635a44c4aa2fcb8d07b
      } catch (err) {
        console.error("Failed to fetch profile data", err);
        setLoading(false);
      }
    });

    // Cleanup function: stop listening for auth and bookings when leaving the page
    return () => {
      unsubAuth();
      if (unsubBookings) unsubBookings();
    };
  }, [router]);

  // show a spinner while data is loading
  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 flex justify-center items-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* user info header */}
      <div className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="mt-2 text-slate-600">Logged in as <span className="font-medium text-slate-900">{user?.email}</span></p>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        // nothing booked yet — show an empty state with a CTA
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
            <Ticket className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't reserved tickets for any upcoming events. Discover extraordinary experiences today.
          </p>
          <Link href="/events" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold !text-white shadow-sm hover:bg-indigo-700 transition">
            Explore Events
          </Link>
        </div>
      ) : (
        // list each booking with its event details and seat numbers
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{booking.event?.title || "Unknown Event"}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {booking.event?.date || "TBD"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {booking.event?.location || "TBD"}
                  </div>
                </div>
              </div>

              {/* seat numbers for this booking */}
              <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-6">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-slate-500 mb-1">Seats Reserved</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map(seat => (
                      <span key={seat} className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-lg">{seat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
