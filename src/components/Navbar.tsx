"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, House, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { buttonStyles } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-line/80 bg-canvas/92 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="RoomRelay home">
          <span className="relative grid size-10 place-items-center rounded-[0.9rem] bg-brand text-white shadow-lg shadow-brand/15">
            <House aria-hidden="true" size={19} strokeWidth={2.4} />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-canvas bg-ai" />
          </span>
          <span>
            <span className="block text-xl font-extrabold tracking-[-0.045em]">RoomRelay</span>
            <span className="hidden items-center gap-1 text-[0.62rem] font-bold tracking-wide text-muted uppercase lg:flex">
              <ShieldCheck aria-hidden="true" size={10} className="text-brand" />
              Verified student housing
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <LogoutButton />
          <Link
            href="/listings"
            aria-current={pathname.startsWith("/listings") ? "page" : undefined}
            className={`rounded-xl px-3 py-2.5 text-sm font-bold transition sm:px-4 ${
              pathname.startsWith("/listings")
                ? "bg-white text-brand shadow-sm"
                : "text-muted hover:bg-white hover:text-ink"
            }`}
          >
            Find a room
          </Link>
          <Link
            href="/list-room"
            aria-current={pathname === "/list-room" ? "page" : undefined}
            className={buttonStyles({
              variant: pathname === "/list-room" ? "primary" : "dark",
              size: "sm",
              className: "px-4 sm:px-5",
            })}
          >
            <span className="hidden sm:inline">List your room</span>
            <span className="sm:hidden">List room</span>
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
