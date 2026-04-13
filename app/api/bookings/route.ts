// API route for creating a new booking and reserving seats

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendPaymentLinkEmail } from "@/lib/email";

// POST: books seats for an event and sends a payment email to the user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, name, email, seats } = body as {
      eventId?: string;
      name?: string;
      email?: string;
      seats?: string[];
    };

    // Reject the request if any required field is missing
    if (
      !eventId ||
      !name ||
      !email ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // Run everything inside a transaction so two users can't book the same seat at the same time
    const result = await adminDb.runTransaction(async (transaction) => {
      const eventRef = adminDb.collection("events").doc(eventId);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists) {
        throw new Error("Event not found");
      }

      const eventData = eventSnap.data() || {};
      const bookedSeats: string[] = Array.isArray(eventData.bookedSeats)
        ? eventData.bookedSeats
        : [];

      // Check if any of the chosen seats are already taken
      const alreadyTaken = seats.some((seat) => bookedSeats.includes(seat));

      if (alreadyTaken) {
        throw new Error("Some selected seats are already booked");
      }

      const updatedBookedSeats = [...bookedSeats, ...seats];

      // Mark the seats as booked on the event
      transaction.update(eventRef, {
        bookedSeats: updatedBookedSeats,
      });

      // Create a new booking record in the database
      const bookingRef = adminDb.collection("bookings").doc();

      transaction.set(bookingRef, {
        eventId,
        name,
        email,
        seats,
        status: "pending_payment", // Waiting for payment to complete
        createdAt: new Date().toISOString(),
      });

      return { id: bookingRef.id };
    });

    // Email the user a link to complete their payment
    await sendPaymentLinkEmail({
      name,
      email,
      seats,
      bookingId: result.id,
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "Booking created and payment link sent by email",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Booking failed" },
      { status: 400 }
    );
  }
}