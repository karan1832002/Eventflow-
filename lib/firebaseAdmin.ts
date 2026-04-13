// sets up firebase admin SDK — used only in server-side API routes
// admin has elevated access so it should never run in the browser

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// hard fail if the credentials aren't set — better to crash here than get weird auth errors later
if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
  );
}

// reuse the existing app if it's already been initialised (important in serverless environments)
const adminApp = getApps().length
  ? getApp()
  : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);