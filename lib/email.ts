/**
 * lib/email.ts
 * 
 * Contains email notification logic using the Resend service.
 * Handles sending payment links and booking confirmations to users.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a payment link email to a user after they have requested a booking.
 * 
 * @param {Object} params - The booking details.
 * @param {string} params.name - The attendee's name.
 * @param {string} params.email - The attendee's email address.
 * @param {string[]} params.seats - List of seat identifiers being booked.
 * @param {string} params.bookingId - The unique ID of the pending booking.
 * @returns {Promise<void>}
 */
export async function sendPaymentLinkEmail({
  name,
  email,
  seats,
  bookingId,
}: {
  name: string;
  email: string;
  seats: string[];
  bookingId: string;
}) {
  const paymentLink = process.env.STRIPE_PAYMENT_LINK;
  const from = process.env.BOOKING_FROM_EMAIL;

  if (!paymentLink) throw new Error("Missing STRIPE_PAYMENT_LINK");
  if (!from) throw new Error("Missing BOOKING_FROM_EMAIL");

  await resend.emails.send({
    from,
    to: email,
    subject: "Complete your ticket payment",
    html: `
      <h2>Hi ${name},</h2>
      <p>Your booking request was received.</p>
      <p><strong>Seats:</strong> ${seats.join(", ")}</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p>Please complete payment here:</p>
      <p><a href="${paymentLink}">Pay with Stripe</a></p>
    `,
  });
}