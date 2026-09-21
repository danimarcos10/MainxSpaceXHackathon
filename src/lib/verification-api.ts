export interface StudentSession {
  verified: boolean;
  email: string | null;
}

async function readErrorMessage(response: Response, fallback: string) {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error(fallback);
  }

  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    throw new Error(payload.error);
  }

  throw new Error(fallback);
}

export async function requestVerificationCode(email: string) {
  const response = await fetch("/api/auth/request-code", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    await readErrorMessage(
      response,
      "The verification email could not be sent. Please retry.",
    );
  }
}

export async function submitVerificationCode(email: string, code: string) {
  const response = await fetch("/api/auth/verify-code", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    await readErrorMessage(
      response,
      "The verification code could not be checked. Please retry.",
    );
  }
}

export async function getStudentSession(): Promise<StudentSession> {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    return { verified: false, email: null };
  }

  const payload: unknown = await response.json();
  if (
    payload &&
    typeof payload === "object" &&
    "verified" in payload &&
    typeof payload.verified === "boolean"
  ) {
    const email =
      "email" in payload && typeof payload.email === "string"
        ? payload.email
        : null;

    return { verified: payload.verified, email };
  }

  return { verified: false, email: null };
}

export async function logoutStudentSession() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });

  if (!response.ok) {
    await readErrorMessage(response, "You could not be logged out. Please retry.");
  }
}
