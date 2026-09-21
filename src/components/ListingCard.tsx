import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sofa } from "lucide-react";
import { PermissionBadge } from "@/components/PermissionBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { Listing, User } from "@/types";

interface ListingCardProps {
  listing: Listing;
  owner?: User;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function formatDateRange(startDate: string, endDate: string) {
  const start = dateFormatter.format(new Date(`${startDate}T00:00:00Z`));
  const end = dateFormatter.format(new Date(`${endDate}T00:00:00Z`));
  return `${start} – ${end}`;
}

export function ListingCard({ listing, owner }: ListingCardProps) {
  const isDanielListing = listing.ownerId === "daniel";

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/8 ${
        isDanielListing ? "border-brand/35 ring-4 ring-brand/5" : "border-line"
      }`}
    >
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#eef0eb]">
          <Image
            src={listing.image}
            alt={`${listing.title}, ${listing.area}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {isDanielListing && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              Perfect for exchange
            </span>
          )}
          <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight aria-hidden="true" size={17} />
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
              {listing.area}
            </p>
            <p className="text-lg font-bold tracking-tight">
              €{listing.price}
              <span className="text-xs font-normal text-muted"> / month</span>
            </p>
          </div>

          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.025em]">{listing.title}</h2>

          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" size={16} className="text-brand" />
              {formatDateRange(listing.startDate, listing.endDate)}
            </span>
            {listing.furnished && (
              <span className="flex items-center gap-2">
                <Sofa aria-hidden="true" size={16} className="text-brand" />
                Furnished
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            {owner?.verified && <VerificationBadge compact />}
            <PermissionBadge status={listing.permissionStatus} />
          </div>
        </div>
      </Link>
    </article>
  );
}
