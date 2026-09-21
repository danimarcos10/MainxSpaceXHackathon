import { randomBytes, randomInt } from "node:crypto";

const CODE_LENGTH = 6;
const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_REQUESTS_PER_HOUR = 3;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;

export const STUDENT_SESSION_COOKIE = "roomrelay_student_session";

export interface EmailVerificationRecord {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  requestedAt: number[];
}

interface StudentSession {
  token: string;
  email: string;
}

interface EmailVerificationStore {
  verifications: Map<string, EmailVerificationRecord>;
  verifiedEmails: Set<string>;
  sessions: Map<string, StudentSession>;
}

const globalForStore = globalThis as typeof globalThis & {
  roomrelayEmailVerificationStore?: EmailVerificationStore;
};

function getStore(): EmailVerificationStore {
  if (!globalForStore.roomrelayEmailVerificationStore) {
    globalForStore.roomrelayEmailVerificationStore = {
      verifications: new Map(),
      verifiedEmails: new Set(),
      sessions: new Map(),
    };
  }

  return globalForStore.roomrelayEmailVerificationStore;
}

function pruneRequestTimes(requestedAt: number[], now = Date.now()) {
  return requestedAt.filter((timestamp) => now - timestamp < REQUEST_WINDOW_MS);
}

export function generateVerificationCode() {
  return randomInt(0, 10 ** CODE_LENGTH)
    .toString()
    .padStart(CODE_LENGTH, "0");
}

export function getVerification(email: string) {
  return getStore().verifications.get(email);
}

export function canRequestVerificationCode(email: string) {
  const record = getStore().verifications.get(email);
  if (!record) return { allowed: true as const };

  const recentRequests = pruneRequestTimes(record.requestedAt);
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return {
      allowed: false as const,
      error:
        "Too many verification emails were requested for this address. Please wait up to an hour before requesting another code.",
    };
  }

  return { allowed: true as const };
}

export function createVerificationCode(email: string) {
  const store = getStore();
  const now = Date.now();
  const existing = store.verifications.get(email);
  const requestedAt = pruneRequestTimes(existing?.requestedAt ?? [], now);
  requestedAt.push(now);

  const record: EmailVerificationRecord = {
    email,
    code: generateVerificationCode(),
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    requestedAt,
  };

  store.verifications.set(email, record);
  return { record, previous: existing };
}

export function restoreVerification(
  email: string,
  previous: EmailVerificationRecord | undefined,
) {
  const store = getStore();
  if (previous) {
    store.verifications.set(email, previous);
    return;
  }

  store.verifications.delete(email);
}

export type VerifyCodeResult =
  | { ok: true; email: string }
  | { ok: false; error: string; status: number };

export function verifyCode(email: string, code: string): VerifyCodeResult {
  const store = getStore();
  const record = store.verifications.get(email);

  if (!record) {
    return {
      ok: false,
      status: 400,
      error: "No verification code was found for this email. Please request a new one.",
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    return {
      ok: false,
      status: 400,
      error: "This verification code has expired. Please request a new one.",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      ok: false,
      status: 400,
      error:
        "This verification code is no longer valid because too many attempts were made. Please request a new one.",
    };
  }

  if (record.code !== code) {
    record.attempts += 1;
    store.verifications.set(email, record);

    if (record.attempts >= MAX_ATTEMPTS) {
      record.expiresAt = now;
      store.verifications.set(email, record);
      return {
        ok: false,
        status: 400,
        error:
          "This verification code is no longer valid because too many attempts were made. Please request a new one.",
      };
    }

    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      ok: false,
      status: 400,
      error: `That code is incorrect. You have ${remaining} attempt${remaining === 1 ? "" : "s"} left.`,
    };
  }

  store.verifiedEmails.add(email);
  store.verifications.delete(email);
  return { ok: true, email };
}

export function isEmailVerified(email: string) {
  return getStore().verifiedEmails.has(email);
}

export function createStudentSession(email: string) {
  const store = getStore();
  const token = randomBytes(24).toString("hex");
  store.sessions.set(token, { token, email });
  return token;
}

export function getSessionEmail(token: string | undefined) {
  if (!token) return null;

  const session = getStore().sessions.get(token);
  if (!session) return null;
  if (!getStore().verifiedEmails.has(session.email)) return null;

  return session.email;
}

export function deleteStudentSession(token: string | undefined) {
  if (!token) return;
  getStore().sessions.delete(token);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
