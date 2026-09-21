import { NextResponse } from "next/server";
import {
  createStudentSession,
  SESSION_COOKIE_OPTIONS,
  STUDENT_SESSION_COOKIE,
  verifyCode,
} from "@/lib/email-verification-store";
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
  const codeValue =
    body && typeof body === "object" && "code" in body ? body.code : null;

  const email =
    typeof emailValue === "string" ? normalizeStudentEmail(emailValue) : "";
  const code = typeof codeValue === "string" ? codeValue.trim() : "";

  const domainError = studentEmailError(email);
  if (domainError) {
    return NextResponse.json({ error: domainError }, { status: 400 });
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: "Please enter the 6-digit code from your email." },
      { status: 400 },
    );
  }

  const result = verifyCode(email, code);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const token = createStudentSession(result.email);
  const response = NextResponse.json({
    ok: true,
    verified: true,
    email: result.email,
  });

  response.cookies.set(STUDENT_SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
