import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export async function PUT(req: NextRequest, { params }: any) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [, token] = authHeader.split(" ");
  const decoded = await adminAuth.verifyIdToken(token);

  const docRef = adminDb.collection("events").doc