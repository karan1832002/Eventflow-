import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendPaymentLinkEmail } from "@/lib/email";

// POST /api/bookings — reserves seats for an event and emails the user a payment link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, name, email, seats } = body as {
      eventId?: string;
      name?: string;
      email?: string;
      seats?: string[];
    };

    // bail early if anything important is missing
    if (!eventId || !name || !email || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    // wrap everything in a transaction — this stops two people booking the same seat at the same time
    const result = await adminDb.runTransaction(async (transaction) => {
      const eventRef = adminDb.collection("events").doc(eventId);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists) throw new Error("Event not found");

      const eventData = eventSnap.data() || {};
      const bookedSeats: string[] = Array.isArray(eventData.bookedSeats) ? eventData.bookedSeats : [];

      // check if any of the requested seats are already taken
      if (seats.some((seat) => bookedSeats.includes(seat))) {
        throw new Error("Some selected seats are already booked");
      }

      // add the new seats to the event's booked list
      transaction.update(eventRef, { bookedSeats: [...bookedSeats, ...seats] });

      // create the booking record with a pending status until payment goes through
      const bookingRef = adminDb.collection("bookings").doc();
      transaction.set(bookingRef, {
        eventId, name, email, seats,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
      });

      return { id: bookingRef.id };
    });

    // send the payment link to the user's email
    await sendPaymentLinkEmail({ name, email, seats, bookingId: result.id });

    return NextResponse.json({ success: true, id: result.id, message: "Booking created and payment link sent by email" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Booking failed" }, { status: 400 });
  }
}