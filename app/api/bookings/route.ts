/**
 * app/api/bookings/route.ts
 * 
 * API route for creating new event bookings.
 * Handles transactional seat reservations in Firestore and triggers payment link emails.
 */

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendPaymentLinkEmail } from "@/lib/email";

/**
 * POST Handler
 * 
 * Creates a booking by reserving seats in an event document and creating a booking record.
 * Uses a Firestore transaction to ensure data integrity and prevent double-booking.
 * 
 * @param {Request} req - The standard Next.js request object.
 * @returns {Promise<NextResponse>} JSON response with success status or error.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, name, email, seats } = body as {
      eventId?: string;
      name?: string;
      email?: string;
      seats?: string[];
    };

    // Validate required fields
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

    // Execute booking within a transaction to handle concurrency
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

      // Check if any of the requested seats are already taken
      const alreadyTaken = seats.some((seat) => bookedSeats.includes(seat));

      if (alreadyTaken) {
        throw new Error("Some selected seats are already booked");
      }

      const updatedBookedSeats = [...bookedSeats, ...seats];

      // Update event document with new booked seats
      transaction.update(eventRef, {
        bookedSeats: updatedBookedSeats,
      });

      // Create a unique booking record
      const bookingRef = adminDb.collection("bookings").doc();

      transaction.set(bookingRef, {
        eventId,
        name,
        email,
        seats,
        status: "pending_payment", // Initial status before payment confirmation
        createdAt: new Date().toISOString(),
      });

      return { id: bookingRef.id };
    });

    // Send a mock payment link email to the user (via Resend)
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
    // Handle specific errors from the transaction or validation
    return NextResponse.json(
      { error: error.message || "Booking failed" },
      { status: 400 }
    );
  }
}