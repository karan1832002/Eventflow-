import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [, token] = authHeader.split(" ");
  const decoded = await adminAuth.verifyIdToken(token);

  const snap = await adminDb
    .collection("bookings")
    .where("userId", "==", decoded.uid)
    .orderBy("bookingDate", "desc")
    .get();

  const bookings = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  return NextResponse.json({ bookings });
}
