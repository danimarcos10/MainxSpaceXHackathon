"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, X } from "lucide-react";

interface BookingRequestModalProps {
  ownerName: string;
}

export function BookingRequestModal({ ownerName }: BookingRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function sendRequest() {
    setRequested(true);
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={sendRequest}
        disabled={requested}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 font-bold text-white shadow-lg shadow-brand/15 transition hover:bg-brand-dark disabled:cursor-default disabled:bg-ink disabled:shadow-none"
      >
        {requested ? (
          <>
            <Clock3 aria-hidden="true" size={18} />
            Request pending
          </>
        ) : (
          "Request this room"
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/55 p-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-success-title"
            className="relative w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close request confirmation"
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-canvas text-muted transition hover:text-ink"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
              <CheckCircle2 aria-hidden="true" size={28} />
            </span>
            <h2 id="request-success-title" className="mt-6 text-2xl font-bold tracking-tight">
              Request sent to {ownerName}
            </h2>
            <p className="mt-3 leading-7 text-muted">
              We&apos;ll let you know when {ownerName} responds. No payment has been taken.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-7 w-full rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-brand"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
