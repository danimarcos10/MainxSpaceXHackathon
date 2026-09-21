"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { GraduationCap, LoaderCircle, X } from "lucide-react";
import { StudentEmailVerification } from "@/components/StudentEmailVerification";
import { getStudentSession } from "@/lib/verification-api";

interface StudentAccessGateProps {
  children: ReactNode;
  mode: "page" | "booking";
}

export function StudentAccessGate({ children, mode }: StudentAccessGateProps) {
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  async function refreshSession() {
    const session = await getStudentSession();
    setVerified(session.verified);
    return session.verified;
  }

  useEffect(() => {
    let active = true;

    getStudentSession()
      .then((session) => {
        if (active) setVerified(session.verified);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking && mode === "page") {
    return (
      <div className="grid min-h-64 place-items-center px-5 py-16">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
          Checking student verification...
        </p>
      </div>
    );
  }

  if (!checking && mode === "page" && !verified) {
    return (
      <div className="mx-auto max-w-lg px-5 py-10 sm:px-8 sm:py-14">
        <StudentEmailVerification
          description="You need a verified Maastricht University email before you can list a room."
          onVerified={() => setVerified(true)}
        />
      </div>
    );
  }

  function interceptBookingClick(event: MouseEvent<HTMLDivElement>) {
    if (checking || verified) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("button");
    if (!button) return;

    const label = button.textContent?.toLowerCase() ?? "";
    if (!label.includes("request this room") && !label.includes("request pending")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setShowPrompt(true);
  }

  return (
    <div onClickCapture={mode === "booking" ? interceptBookingClick : undefined}>
      {children}

      {mode === "booking" && showPrompt && !verified && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/55 p-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPrompt(false);
          }}
        >
          <div className="relative w-full max-w-lg">
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              aria-label="Close verification"
              className="absolute right-5 top-5 z-10 grid size-9 place-items-center rounded-full bg-canvas text-muted transition hover:text-ink"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-ink">
              <GraduationCap aria-hidden="true" size={18} className="text-brand" />
              Verify your student email before requesting a room.
            </div>
            <StudentEmailVerification
              description="Booking is limited to verified Maastricht University students."
              onVerified={async () => {
                await refreshSession();
                setShowPrompt(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
