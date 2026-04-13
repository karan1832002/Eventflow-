/**
 * app/api/events/[id]/route.ts
 * 
 * Dynamic API route for individual event operations.
 * Supports fetching event details, updating an event, and deleting an event.
 * Requires authentication and authorization for modifying operations.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

/**
 * GET Handler
 * 
 * Fetches the details of a specific event by ID.
 * 
 * @param {NextRequest} _ - The request object (unused).
 * @param {Object} context - Route context containing params.
 * @returns {Promise<NextResponse>} JSON response with event data or error.
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event: { id: doc.id, ...(doc.data() as any) } });
}

/**
 * PUT Handler
 * 
 * Updates an existing event document.
 * Requires Authorization header with a valid Firebase token. 
 * Authorizes the operation by checking if the user is the organizer.
 * 
 * @param {NextRequest} req - The request object.
 * @param {Object} context - Route context containing params.
 * @returns {Promise<NextResponse>} JSON response with success status or error.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [, token] = authHeader.split(" ");
    const decoded = await adminAuth.verifyIdToken(token);
    const { id } = await params;

    const docRef = adminDb.collection("events").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = doc.data() as any;
    // Verify that the user requesting the update is the original organizer
    if (event.organizerId && event.organizerId !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    // Update document with new fields and timestamp
    await docRef.update({ ...body, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE Handler
 * 
 * Removes an event document from Firestore.
 * Requires Authorization header and organizer ownership.
 * 
 * @param {NextRequest} req - The request object.
 * @param {Object} context - Route context containing params.
 * @returns {Promise<NextResponse>} JSON response with success status or error.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [, token] = authHeader.split(" ");
    const decoded = await adminAuth.verifyIdToken(token);
    const { id } = await params;

    const docRef = adminDb.collection("events").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = doc.data() as any;
    // Verify ownership before deletion
    if (event.organizerId && event.organizerId !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Deletion failed" }, { status: 500 });
  }
}

