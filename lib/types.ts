export type UserRole = "organizer" | "attendee";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  organizerId: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: string;
  status: "confirmed" | "cancelled";
}