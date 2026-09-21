import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="RoomRelay home">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-sm">
            <Home aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-bold tracking-[-0.04em]">RoomRelay</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/listings"
            className="rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white sm:px-4"
          >
            Find a room
          </Link>
          <Link
            href="/list-room"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand sm:px-5"
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
