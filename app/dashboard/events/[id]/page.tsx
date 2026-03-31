"use client";

import EventForm from "@/components/EventForm";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [initial, setInitial] = useState<any>(null);

  useEffect(() => {
    params.then(async ({ id }) => {
      setEventId(id);
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      setInitial(data.event);
    });
  }, [params]);

  const updateEvent = async (data: any) => {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) router.push("/dashboard");
  };

  if (!initial) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Event</h1>
      <EventForm initial={initial} onSubmit={updateEvent} />
    </div>
  );
}
