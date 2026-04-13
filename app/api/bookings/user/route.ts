/**
 * app/api/bookings/user/route.ts
 * 
 * API route for fetching bookings belonging to the currently authenticated user.
 * Requires a valid Firebase ID token in the Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

/**
 * GET Handler
 * 
 * Verifies the user's token and queries Firestore for bookings matching their UID.
 * 
 * @param {NextRequest} req - The standard Next.js request object.
 * @returns {Promise<NextResponse>} JSON response with a list of user bookings or an error.
 */
export async function GET(req: NextRequest) {
  // Check for the Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract and verify the Firebase ID token
    const [, token] = authHeader.split(" ");
    const decoded = await adminAuth.verifyIdToken(token);

    // Query Firestore for bookings associated with the user's UID
    const snap = await adminDb
      .collection("bookings")
      .where("userId", "==", decoded.uid)
      .orderBy("bookingDate", "desc") // Sort by booking date
      .get();

    // Map Firestore documents to a cleaner response format
    const bookings = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json({ bookings });
  } catch (error: any) {
    // Handle token verification errors or query failures
    return NextResponse.json({ error: error.message || "Failed to fetch bookings" }, { status: 500 });
  }
}

