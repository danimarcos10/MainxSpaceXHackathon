import { NextResponse } from "next/server";
import {
  canRequestVerificationCode,
  createVerificationCode,
  restoreVerification,
} from "@/lib/email-verification-store";
import { sendVerificationEmail } from "@/lib/resend";
import {
  normalizeStudentEmail,
  studentEmailError,
} from "@/lib/student-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The request could not be read. Please retry." },
      { status: 400 },
    );
  }

  const emailValue =
    body && typeof body === "object" && "email" in body ? body.email : null;
  const email =
    typeof emailValue === "string" ? normalizeStudentEmail(emailValue) : "";

  const domainError = studentEmailError(email);
  if (domainError) {
    return NextResponse.json({ error: domainError }, { status: 400 });
  }

  const rateLimit = canRequestVerificationCode(email);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.error }, { status: 429 });
  }

  const { record, previous } = createVerificationCode(email);

  try {
    await sendVerificationEmail(email, record.code);
  } catch (error) {
    restoreVerification(email, previous);
    console.error("Verification email failed:", error);

    if (error instanceof Error && error.message === "RESEND_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Email verification is not configured on this server." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "The verification email could not be sent. Please retry." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "A 6-digit verification code was sent to your student email.",
  });
}
