// firebase auth helper functions used across the app

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

// creates a new account and saves a basic user profile in firestore
export const registerUser = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email: cred.user.email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return cred;
};

// signs in an existing user
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// signs out whoever is currently logged in
export const logoutUser = async () => {
  return await signOut(auth);
};

// listens for auth state changes — call this to know when a user logs in or out
export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// looks up a user's role from firestore (e.g. "admin" or "user")
export const getUserRole = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data().role as string | null;
};