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
  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-xl hover:shadow-ink/[0.07]">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-line">
          <Image
            src={listing.image}
            alt={`${listing.title}, ${listing.area}`}
            fill
            unoptimized={listing.image.startsWith("data:image/")}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl bg-white/95 text-ink shadow-sm backdrop-blur transition group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight aria-hidden="true" size={17} />
          </span>
        </div>

        <div className="p-5 sm:p-5">
          <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
            {listing.area}
          </p>

          <h2 className="mt-1.5 text-lg font-extrabold tracking-[-0.025em]">
            {listing.title}
          </h2>

          <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-muted">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" size={16} className="text-brand" />
              {formatDateRange(listing.startDate, listing.endDate)}
            </span>
            <span className="flex items-center gap-2">
              <Sofa aria-hidden="true" size={16} className="text-brand" />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {owner?.verified && <VerificationBadge compact />}
              <PermissionBadge status={listing.permissionStatus} showUnchecked />
            </div>
            <p className="shrink-0 text-lg font-extrabold tracking-tight">
              €{listing.price}
              <span className="block text-right text-[0.68rem] font-semibold text-muted">
                per month
              </span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
