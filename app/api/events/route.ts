import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET /api/events — returns all events sorted by date
export async function GET() {
  try {
    const snap = await adminDb.collection("events").orderBy("date", "asc").get();

    // turn each firestore doc into a plain object with its ID
    const events = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events — creates a new event from the request body
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, location, date, time, price, description, capacity, bookedSeats } = body;

    // these four are the bare minimum to create an event
    if (!title || !category || !location || !date) {
      return NextResponse.json({ error: "title, category, location and date are required" }, { status: 400 });
    }

    // save the event and let firestore generate the ID
    const docRef = await adminDb.collection("events").add({
      title, category, location, date,
      time: time || "",
      price: Number(price) || 0,
      description: description || "",
      capacity: Number(capacity) || 50,
      bookedSeats: bookedSeats || [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create event" }, { status: 500 });
  }
}