"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import {
  getStudentSession,
  logoutStudentSession,
} from "@/lib/verification-api";

export function LogoutButton() {
  const [verified, setVerified] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    getStudentSession().then((session) => {
      if (active) setVerified(session.verified);
    });

    return () => {
      active = false;
    };
  }, []);

  if (!verified) return null;

  async function logOut() {
    setLoggingOut(true);
    try {
      await logoutStudentSession();
      window.location.assign("/");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logOut}
      disabled={loggingOut}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink disabled:opacity-50 sm:px-4"
    >
      <LogOut aria-hidden="true" size={15} />
      {loggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}
