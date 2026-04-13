/**
 * lib/auth.ts
 * 
 * Provides Firebase Authentication helper functions for client-side usage,
 * including user registration, login, logout, and role management.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Registers a new user with email and password and initializes their Firestore document.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} - The Firebase user credential object.
 */
export const registerUser = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email: cred.user.email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return cred;
};

/**
 * Logs in a user using their email and password.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} - The Firebase user credential object.
 */
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 * 
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  return await signOut(auth);
};

/**
 * Observes the current authentication state and calls the provided callback on change.
 * 
 * @param {Function} callback - The function to call when authentication state changes.
 * @returns {Unsubscribe} - The unsubscribe function for the listener.
 */
export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Retrieves the role of a user from their Firestore profile.
 * 
 * @param {string} uid - The user's unique identifier.
 * @returns {Promise<string|null>} - The user's role (e.g., 'admin', 'user') or null if not found.
 */
export const getUserRole = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data().role as string | null;
};