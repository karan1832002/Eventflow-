// sends booking confirmation emails using Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// emails the user a stripe payment link after their seats are reserved
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

  // these env vars must be set or the email won't work
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