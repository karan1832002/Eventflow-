// Auth helpers - wraps Firebase auth functions for use across the app

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Creates a new account and saves the user's profile in the database
export const registerUser = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email: cred.user.email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return cred;
};

// Signs in an existing user with email and password
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Signs out the current user
export const logoutUser = async () => {
  return await signOut(auth);
};

// Listens for auth state changes and runs the callback whenever the user signs in or out
export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Looks up a user's role (e.g. "admin" or "user") from the database
export const getUserRole = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data().role as string | null;
};