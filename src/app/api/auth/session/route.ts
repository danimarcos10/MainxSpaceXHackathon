import { NextRequest, NextResponse } from "next/server";
import {
  getSessionEmail,
  STUDENT_SESSION_COOKIE,
} from "@/lib/email-verification-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const email = getSessionEmail(
    request.cookies.get(STUDENT_SESSION_COOKIE)?.value,
  );

  return NextResponse.json({
    verified: Boolean(email),
    email,
  });
}
