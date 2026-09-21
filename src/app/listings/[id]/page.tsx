"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MapPin,
  ShieldCheck,
  Sofa,
  Sparkles,
} from "lucide-react";
import { BookingRequestModal } from "@/components/BookingRequestModal";
import { PermissionBadge } from "@/components/PermissionBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { buttonStyles } from "@/components/ui/Button";
import { getUserById, listings } from "@/lib/demo-data";
import { useUserListings } from "@/lib/listing-storage";
import type { PermissionStatus } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const permissionTrust: Record<
  PermissionStatus,
  { title: string; detail: string; icon: typeof CheckCircle2; className: string }
> = {
  verified: {
    title: "Permission verified",
    detail: "Subletting permission has been checked",
    icon: CheckCircle2,
    className: "text-brand",
  },
  pending: {
    title: "Check pending",
    detail: "Permission is currently being reviewed",
    icon: Clock3,
    className: "text-warning",
  },
  permission_required: {
    title: "Permission required",
    detail: "Written landlord permission is still needed",
    icon: CircleAlert,
    className: "text-warning",
  },
  unchecked: {
    title: "Not checked",
    detail: "Subletting permission has not been checked",
    icon: CircleAlert,
    className: "text-subtle",
  },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mockListing = listings.find((item) => item.id === id && item.published);
  const { hydrated, listings: userListings } = useUserListings();
  const listing =
    mockListing ?? userListings.find((item) => item.id === id && item.published);

  if (!listing && !hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading listing"
        className="mx-auto max-w-7xl animate-pulse px-5 py-10 sm:px-8"
      >
        <div className="h-5 w-32 rounded bg-line" />
        <div className="mt-6 aspect-[16/9] max-h-[34rem] rounded-[1.75rem] bg-line" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
          <MapPin aria-hidden="true" size={21} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
          This room isn&apos;t available.
        </h1>
        <p className="mt-3 text-muted">
          The listing may have been removed or was created in another browser.
        </p>
        <Link href="/listings" className={buttonStyles({ className: "mt-7" })}>
          Browse available rooms
        </Link>
      </div>
    );
  }

  const owner = getUserById(listing.ownerId);
  if (!owner) return null;

  const permission = permissionTrust[listing.permissionStatus];
  const PermissionIcon = permission.icon;
  const formattedDates = `${dateFormatter.format(
    new Date(`${listing.startDate}T00:00:00Z`),
  )} – ${dateFormatter.format(new Date(`${listing.endDate}T00:00:00Z`))}`;

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 py-8 pb-28 sm:px-8 sm:py-10 sm:pb-28 lg:pb-14">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to all rooms
        </Link>

        <div className="relative mt-6 aspect-[16/9] max-h-[34rem] overflow-hidden rounded-[1.75rem] bg-line">
          <Image
            src={listing.image}
            alt={`${listing.title} in ${listing.area}`}
            fill
            priority
            unoptimized={listing.image.startsWith("data:image/")}
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink/55 to-transparent" />
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-6 sm:left-6">
            {owner.verified && <VerificationBadge />}
            <PermissionBadge status={listing.permissionStatus} showUnchecked />
          </div>
        </div>

        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_23rem]">
          <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-brand uppercase">
                  <MapPin aria-hidden="true" size={15} />
                  {listing.area} · Maastricht
                </p>
                <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-balance sm:text-5xl">
                  {listing.title}
                </h1>
              </div>
              <p className="whitespace-nowrap text-3xl font-extrabold tracking-tight">
                €{listing.price}
                <span className="text-sm font-medium text-muted"> / month</span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <MetaChip icon={CalendarDays}>{formattedDates}</MetaChip>
              <MetaChip icon={Sofa}>
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </MetaChip>
              <MetaChip icon={Sparkles}>Temporary student stay</MetaChip>
            </div>

            <section className="mt-10 border-t border-line pt-9">
              <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                About the room
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                A temporary home in {listing.area}
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
                {listing.description}
              </p>
            </section>

            <section className="mt-10 border-t border-line pt-9">
              <div className="rounded-[1.25rem] border border-line bg-white p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <span className="grid size-13 place-items-center rounded-2xl bg-ink text-lg font-extrabold text-white">
                      {owner.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">
                        Your host
                      </p>
                      <p className="mt-1 text-lg font-extrabold">{owner.name}</p>
                      <p className="text-sm text-muted">{owner.university}</p>
                    </div>
                  </div>
                  {owner.verified && <VerificationBadge label="University verified" />}
                </div>
              </div>
            </section>

            <section className="mt-10 overflow-hidden rounded-[1.5rem] border border-brand/15 bg-brand-soft/55">
              <div className="flex items-center gap-4 border-b border-brand/10 p-6 sm:p-8">
                <span className="grid size-11 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/15">
                  <ShieldCheck aria-hidden="true" size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                    Safer student subletting
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                    RoomRelay Trust Check
                  </h2>
                </div>
              </div>

              <div className="grid gap-px bg-brand/10 sm:grid-cols-3">
                <TrustItem
                  number="01"
                  icon={CheckCircle2}
                  title="Student identity"
                  detail={`${owner.university} verified`}
                />
                <TrustItem
                  number="02"
                  icon={listing.furnished ? CheckCircle2 : CircleAlert}
                  title="Listing facts"
                  detail={
                    listing.furnished
                      ? "Furnished temporary stay"
                      : "Unfurnished temporary stay"
                  }
                />
                <TrustItem
                  number="03"
                  icon={PermissionIcon}
                  iconClassName={permission.className}
                  title={permission.title}
                  detail={permission.detail}
                />
              </div>
            </section>
          </div>

          <aside className="hidden h-fit rounded-[1.5rem] border border-line bg-white p-6 shadow-xl shadow-ink/[0.06] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block">
            <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
              No-obligation request
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">Make it your room</p>
            <div className="mt-5 rounded-2xl bg-canvas p-4">
              <p className="text-sm font-bold">{formattedDates}</p>
              <p className="mt-1 text-xs text-muted">
                Send a request to {owner.name}. No payment is taken.
              </p>
            </div>
            <div className="mt-5">
              <BookingRequestModal ownerName={owner.name} />
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
              <ShieldCheck aria-hidden="true" size={14} className="text-brand" />
              Verified student community
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-10px_30px_rgba(23,35,29,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="shrink-0">
            <p className="text-lg font-extrabold">€{listing.price}</p>
            <p className="text-[0.68rem] font-semibold text-muted">per month</p>
          </div>
          <div className="min-w-0 flex-1">
            <BookingRequestModal ownerName={owner.name} />
          </div>
        </div>
      </div>
    </>
  );
}

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof CalendarDays;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold">
      <Icon aria-hidden="true" size={16} className="text-brand" />
      {children}
    </span>
  );
}

function TrustItem({
  number,
  icon: Icon,
  title,
  detail,
  iconClassName = "text-brand",
}: {
  number: string;
  icon: typeof CheckCircle2;
  title: string;
  detail: string;
  iconClassName?: string;
}) {
  return (
    <div className="bg-white/80 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <Icon aria-hidden="true" size={22} className={iconClassName} />
        <span className="text-[0.65rem] font-extrabold text-subtle">{number}</span>
      </div>
      <p className="mt-5 text-sm font-extrabold">{title}</p>
      <p className="mt-1 text-sm leading-5 text-muted">{detail}</p>
    </div>
  );
}
