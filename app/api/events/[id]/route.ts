import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await adminDb.collection("events").doc(id).get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event: { id: doc.id, ...(doc.data() as any) } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [, token] = authHeader.split(" ");
  const decoded = await adminAuth.verifyIdToken(token);
  const { id } = await params;

  const docRef = adminDb.collection("events").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const event = doc.data() as any;
  if (event.organizerId !== decoded.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  await docRef.update({ ...body, updatedAt: new Date().toISOString() });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [, token] = authHeader.split(" ");
  const decoded = await adminAuth.verifyIdToken(token);
  const { id } = await params;

  const docRef = adminDb.collection("events").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const event = doc.data() as any;
  if (event.organizerId !== decoded.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await docRef.delete();
  return NextResponse.json({ success: true });
}
