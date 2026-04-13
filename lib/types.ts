/**
 * lib/types.ts
 * 
 * Defines the TypeScript interfaces and types used throughout the application.
 * Centralizing types ensures consistency across components, API routes, and database models.
 */

/**
 * Valid roles for application users.
 */
export type UserRole = "organizer" | "attendee";

/**
 * Represents a user profile in the system.
 */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Represents an event created by an organizer.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  capacity: number;
  organizerId: string;
  createdAt: string;
}

/**
 * Represents a booking made by an attendee for a specific event.
 */
export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: string;
  status: "confirmed" | "cancelled";
}