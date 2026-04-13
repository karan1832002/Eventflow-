// API route for events - supports GET (fetch all) and POST (create new)

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET: returns all events from the database, sorted by date
export async function GET() {
  try {
    const snap = await adminDb.collection("events").orderBy("date", "asc").get();

    // Convert each document into a plain object with its ID
    const events = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST: creates a new event using the data sent in the request body
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      category,
      location,
      date,
      time,
      price,
      description,
      capacity,
      bookedSeats,
    } = body;

    // Make sure the required fields are present before saving
    if (!title || !category || !location || !date) {
      return NextResponse.json(
        { error: "title, category, location and date are required" },
        { status: 400 }
      );
    }

    // Save the new event to the database
    const docRef = await adminDb.collection("events").add({
      title,
      category,
      location,
      date,
      time: time || "",
      price: Number(price) || 0,
      description: description || "",
      capacity: Number(capacity) || 50,
      bookedSeats: bookedSeats || [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}