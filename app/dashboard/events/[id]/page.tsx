/**
 * app/dashboard/events/[id]/page.tsx
 * 
 * An ID-based dynamic route for editing an event.
 * Note: This appears to be a redundant or alternative implementation to the /edit route.
 * Fetches initial event data from the API and provides an update handler via EventForm.
 */

"use client";

import EventForm from "@/components/EventForm";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * EditEventPage Component
 * 
 * @param {Object} props - Component props.
 * @param {Promise} props.params - Dynamic route parameters (containing the event id).
 */
export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [initial, setInitial] = useState<any>(null);

  /**
   * Resolve params promise and fetch event data.
   */
  useEffect(() => {
    params.then(async ({ id }) => {
      setEventId(id);
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      setInitial(data.event);
    });
  }, [params]);

  /**
   * Submits the updated event data to the API.
   * 
   * @param {Object} data - The updated event details.
   */
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

  // Loading indicator while fetching initial data
  if (!initial) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit Event</h1>
      <EventForm initial={initial} onSubmit={updateEvent} />
    </div>
  );
}

