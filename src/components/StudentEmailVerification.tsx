"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BadgeCheck, LoaderCircle, Mail } from "lucide-react";
import {
  requestVerificationCode,
  submitVerificationCode,
} from "@/lib/verification-api";

const inputClassName =
  "mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink transition placeholder:text-muted/60 focus:border-brand focus:bg-white";

interface StudentEmailVerificationProps {
  onVerified?: (email: string) => void;
  description?: string;
}

export function StudentEmailVerification({
  onVerified,
  description = "Use your Maastricht University email to unlock posting and booking.",
}: StudentEmailVerificationProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      await requestVerificationCode(email);
      setCodeSent(true);
      setCode("");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "The verification email could not be sent. Please retry.",
      );
    } finally {
      setSending(false);
    }
  }

  async function confirmCode(event: FormEvent) {
    event.preventDefault();
    setVerifying(true);
    setError(null);

    try {
      await submitVerificationCode(email, code);
      const normalized = email.trim().toLowerCase();
      if (onVerified) {
        onVerified(normalized);
      } else {
        setVerifiedEmail(normalized);
      }
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "The verification code could not be checked. Please retry.",
      );
    } finally {
      setVerifying(false);
    }
  }

  if (verifiedEmail) {
    return (
      <div className="rounded-[2rem] border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
        <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
          <BadgeCheck aria-hidden="true" size={28} />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Student email verified</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {verifiedEmail} can now list a room and request a stay.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Find a room
          </Link>
          <Link
            href="/list-room"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm font-bold text-ink transition hover:border-brand/30"
          >
            List your room
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
      <p className="text-sm font-bold tracking-[0.16em] text-brand uppercase">
        Student verification
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-[-0.035em]">
        Verify your university email
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>

      <form onSubmit={sendCode} className="mt-8">
        <label className="text-sm font-bold">
          Maastricht University email
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setCodeSent(false);
            }}
            placeholder="name@student.maastrichtuniversity.nl"
            className={inputClassName}
          />
        </label>
        <button
          type="submit"
          disabled={sending || !email.trim()}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-45"
        >
          {sending ? (
            <>
              <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              <Mail aria-hidden="true" size={18} />
              {codeSent ? "Resend code" : "Send verification code"}
            </>
          )}
        </button>
      </form>

      {codeSent && (
        <form onSubmit={confirmCode} className="mt-6 border-t border-line pt-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
            <BadgeCheck aria-hidden="true" size={18} />
            A 6-digit code was sent to your email.
          </p>
          <label className="mt-5 block text-sm font-bold">
            Verification code
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className={`${inputClassName} tracking-[0.35em]`}
            />
          </label>
          <button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-45"
          >
            {verifying ? (
              <>
                <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
                Checking code...
              </>
            ) : (
              "Verify email"
            )}
          </button>
        </form>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}
