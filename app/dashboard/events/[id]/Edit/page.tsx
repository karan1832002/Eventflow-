/**
 * app/dashboard/events/[id]/edit/page.tsx
 * 
 * The primary edit page for an existing event.
 * Fetches the current event details from Firestore and uses EventForm for editing.
 * Updates the Firestore document directly upon form submission.
 */

"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/EventForm";

/**
 * EditEventPage Component
 * 
 * Manages the loading and updating of an existing event based on its ID from the URL.
 */
export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [initial, setInitial] = useState<any | null>(null);

  /**
   * Load the event data from Firestore on component mount or when ID changes.
   */
  useEffect(() => {
    const loadEvent = async () => {
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setInitial({ id: snap.id, ...snap.data() });
      }
    };

    loadEvent();
  }, [id]);

  /**
   * Updates the event document in Firestore.
   * 
   * @param {Object} formData - Updated event data from the form.
   */
  const handleUpdate = async (formData: any) => {
    const ref = doc(db, "events", id);

    await updateDoc(ref, {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: Number(formData.capacity),
      price: Number(formData.price),
    });

    // Navigate back to the dashboard after a successful update
    router.push("/dashboard");
  };

  // Show a loading state if data is still being fetched
  if (!initial) {
    return <div className="p-6">Loading...</div>;
  }

  return <EventForm initial={initial} onSubmit={handleUpdate} />;
}