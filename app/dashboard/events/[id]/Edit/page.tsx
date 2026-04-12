"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/EventForm";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [initial, setInitial] = useState<any | null>(null);

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

    router.push("/dashboard/events");
  };

  if (!initial) {
    return <div className="p-6">Loading...</div>;
  }

  return <EventForm initial={initial} onSubmit={handleUpdate} />;
}