import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RoomForm } from "@/components/RoomForm";

export const metadata = {
  title: "List your room",
  description: "List a temporary student room on RoomRelay.",
};

export default function ListRoomPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to home
      </Link>
      <div className="mt-7">
        <RoomForm />
      </div>
    </div>
  );
}
