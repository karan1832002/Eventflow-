import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [, token] = authHeader.split(" ");
  const decoded = await adminAuth.verifyIdToken(token);
  const { id } = await params;

  const docRef = adminDb.collection("bookings").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const booking = doc.data() as any;
  if (booking.userId !== decoded.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await docRef.update({ status: "cancelled" });
  return NextResponse.json({ success: true });
}
