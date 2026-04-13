/**
 * app/api/bookings/[id]/route.ts
 * 
 * Dynamic API route for specific booking operations.
 * Currently supports cancelling a booking.
 * Requires authentication and ownership verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

/**
 * DELETE Handler (Cancellation)
 * 
 * Updates a booking status to 'cancelled' instead of hard-deleting the record.
 * Verifies that the user requesting the cancellation is the one who made the booking.
 * 
 * @param {NextRequest} req - The standard Next.js request object.
 * @param {Object} context - Route context containing params.
 * @returns {Promise<NextResponse>} JSON response with success status or error.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Authentication check
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [, token] = authHeader.split(" ");
    const decoded = await adminAuth.verifyIdToken(token);
    const { id } = await params;

    const docRef = adminDb.collection("bookings").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = doc.data() as any;
    // Ownership check: only the user who created the booking can cancel it
    if (booking.userId && booking.userId !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete: update status to cancelled
    await docRef.update({ status: "cancelled" });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Cancellation failed" }, { status: 500 });
  }
}

