"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, ShieldCheck, X } from "lucide-react";

interface BookingRequestModalProps {
  ownerName: string;
}

export function BookingRequestModal({ ownerName }: BookingRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("button");
    firstFocusable?.focus();

    function handleKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [
          ...dialogRef.current.querySelectorAll<HTMLElement>("button"),
        ].filter((element) => !element.hasAttribute("disabled"));
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function sendRequest() {
    setRequested(true);
    setIsOpen(true);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={sendRequest}
        disabled={requested}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[0.875rem] bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:cursor-default disabled:translate-y-0 disabled:bg-ink disabled:shadow-none"
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
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-success-title"
            aria-describedby="request-success-description"
            className="relative w-full max-w-md rounded-[1.5rem] bg-white p-7 text-center shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close request confirmation"
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-xl bg-canvas text-muted transition hover:text-ink"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <div className="mx-auto flex max-w-[15rem] items-center">
              <span className="grid size-13 place-items-center rounded-2xl bg-ink text-sm font-extrabold text-white">
                You
              </span>
              <span className="h-px flex-1 bg-brand/25" />
              <span className="grid size-9 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/20">
                <CheckCircle2 aria-hidden="true" size={18} />
              </span>
              <span className="h-px flex-1 bg-brand/25" />
              <span className="grid size-13 place-items-center rounded-2xl bg-brand-soft text-lg font-extrabold text-brand">
                {ownerName.charAt(0)}
              </span>
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.14em] text-brand uppercase">
              Students connected
            </p>
            <h2 id="request-success-title" className="mt-6 text-2xl font-bold tracking-tight">
              Request sent to {ownerName}
            </h2>
            <p id="request-success-description" className="mt-3 leading-7 text-muted">
              We&apos;ll let you know when {ownerName} responds. No payment has been taken.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand-soft px-4 py-3 text-xs font-bold text-brand-dark">
              <ShieldCheck aria-hidden="true" size={15} />
              Your student identity is included with the request
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="mt-6 h-12 w-full rounded-[0.875rem] bg-ink px-6 text-sm font-bold text-white transition hover:bg-brand"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
