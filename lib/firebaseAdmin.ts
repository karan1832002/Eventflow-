/**
 * lib/firebaseAdmin.ts
 * 
 * Initializes the Firebase Admin SDK for server-side operations.
 * This is used in API routes to interact with Firestore and Auth with elevated privileges.
 */

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Ensure required environment variables are present
if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
  );
}

// Initialize Admin App (Singleton pattern to prevent re-initialization)
const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

/**
 * Exported Firestore and Auth instances for use in server-side logic.
 */
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);