import { NextRequest, NextResponse } from "next/server";
import {
  deleteStudentSession,
  SESSION_COOKIE_OPTIONS,
  STUDENT_SESSION_COOKIE,
} from "@/lib/email-verification-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  deleteStudentSession(request.cookies.get(STUDENT_SESSION_COOKIE)?.value);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDENT_SESSION_COOKIE, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
