import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await adminDb.collection("events").orderBy("date", "asc").get();
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, location, date, price, description } = body;

    if (!title || !location || !date) {
      return NextResponse.json(
        { error: "title, location and date are required" },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("events").add({
      title,
      location,
      date,
      price: price || 0,
      description: description || "",
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