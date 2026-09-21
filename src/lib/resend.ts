import { Resend } from "resend";

export async function sendVerificationEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }

  const resend = new Resend(apiKey);

  // Swap this Resend test sender for a verified domain address before production.
  const { error } = await resend.emails.send({
    from: "RoomRelay <onboarding@resend.dev>",
    to: email,
    subject: "Verify your student email",
    html: `
      <p>Your RoomRelay verification code is:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:0.2em;margin:24px 0;">${code}</p>
      <p>This code expires in 15 minutes.</p>
    `,
  });

  if (error) {
    console.error("Resend email failed:", error);
    throw new Error("RESEND_SEND_FAILED");
  }
}
