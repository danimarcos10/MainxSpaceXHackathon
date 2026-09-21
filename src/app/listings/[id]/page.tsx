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
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sofa,
} from "lucide-react";
import { BookingRequestModal } from "@/components/BookingRequestModal";
import { PermissionBadge } from "@/components/PermissionBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
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
  { label: string; detail: string; icon: typeof CheckCircle2; className: string }
> = {
  verified: {
    label: "Permission checked",
    detail: "Subletting permission has been verified",
    icon: CheckCircle2,
    className: "text-brand",
  },
  pending: {
    label: "Check pending",
    detail: "Subletting permission is being reviewed",
    icon: Clock3,
    className: "text-amber-600",
  },
  permission_required: {
    label: "Permission required",
    detail: "Written landlord permission is still required",
    icon: CircleAlert,
    className: "text-amber-600",
  },
  unchecked: {
    label: "Not checked",
    detail: "Subletting permission has not been checked",
    icon: CircleAlert,
    className: "text-slate-500",
  },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mockListing = listings.find((item) => item.id === id && item.published);
  const { hydrated, listings: userListings } = useUserListings();
  const listing =
    mockListing ??
    userListings.find((item) => item.id === id && item.published);

  if (!listing && !hydrated) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-10 sm:px-8">
        <div className="h-5 w-32 rounded bg-line" />
        <div className="mt-6 aspect-[16/9] max-h-[34rem] rounded-[2rem] bg-line" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl font-bold">This room isn&apos;t available.</h1>
        <p className="mt-3 text-muted">
          The listing may have been removed or was created in another browser.
        </p>
        <Link
          href="/listings"
          className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 font-bold text-white"
        >
          Browse available rooms
        </Link>
      </div>
    );
  }

  const owner = getUserById(listing.ownerId);
  if (!owner) return null;

  const permission = permissionTrust[listing.permissionStatus];
  const PermissionIcon = permission.icon;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to all rooms
      </Link>

      <div className="relative mt-6 aspect-[16/9] max-h-[34rem] overflow-hidden rounded-[2rem] bg-[#eef0eb]">
        <Image
          src={listing.image}
          alt={`${listing.title} in ${listing.area}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
          <VerificationBadge />
          <PermissionBadge status={listing.permissionStatus} showUnchecked />
        </div>
      </div>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_23rem]">
        <div>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold tracking-[0.12em] text-brand uppercase">
                <MapPin aria-hidden="true" size={15} />
                {listing.area}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                {listing.title}
              </h1>
            </div>
            <p className="whitespace-nowrap text-3xl font-bold tracking-tight">
              €{listing.price}
              <span className="text-sm font-normal text-muted"> / month</span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">
              <CalendarDays aria-hidden="true" size={17} className="text-brand" />
              {dateFormatter.format(new Date(`${listing.startDate}T00:00:00Z`))} –{" "}
              {dateFormatter.format(new Date(`${listing.endDate}T00:00:00Z`))}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">
              <Sofa aria-hidden="true" size={17} className="text-brand" />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </span>
          </div>

          <section className="mt-10 border-t border-line pt-9">
            <h2 className="text-2xl font-bold tracking-tight">About this room</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{listing.description}</p>
          </section>

          <section className="mt-10 border-t border-line pt-9">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-ink text-lg font-bold text-white">
                {owner.name.charAt(0)}
              </span>
              <div>
                <p className="text-lg font-bold">Hosted by {owner.name}</p>
                <p className="text-sm text-muted">{owner.university}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {owner.verified && <VerificationBadge />}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold ring-1 ring-line">
                <GraduationCap aria-hidden="true" size={16} className="text-brand" />
                University verified
              </span>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-brand/15 bg-brand-soft/60 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand text-white">
                <ShieldCheck aria-hidden="true" size={22} />
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                  Safer student subletting
                </p>
                <h2 className="text-2xl font-bold tracking-tight">RoomRelay Trust Check</h2>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <TrustItem
                icon={CheckCircle2}
                title="Student identity"
                detail={`${owner.university} student`}
              />
              <TrustItem
                icon={listing.furnished ? CheckCircle2 : CircleAlert}
                title="Listing"
                detail={
                  listing.furnished ? "Furnished temporary stay" : "Temporary stay information"
                }
              />
              <TrustItem
                icon={PermissionIcon}
                iconClassName={permission.className}
                title="Subletting"
                detail={permission.detail}
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-line bg-white p-6 shadow-xl shadow-ink/6 lg:sticky lg:top-26">
          <p className="text-sm font-semibold text-muted">Ready to make this your Maastricht home?</p>
          <p className="mt-2 text-2xl font-bold">Request the room</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Send a no-obligation request to {owner.name}. You won&apos;t be charged.
          </p>
          <div className="mt-6">
            <BookingRequestModal ownerName={owner.name} />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
            <ShieldCheck aria-hidden="true" size={14} className="text-brand" />
            Student-only, verified community
          </div>
        </aside>
      </div>
    </div>
  );
}

interface TrustItemProps {
  icon: typeof CheckCircle2;
  title: string;
  detail: string;
  iconClassName?: string;
}

function TrustItem({
  icon: Icon,
  title,
  detail,
  iconClassName = "text-brand",
}: TrustItemProps) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <Icon aria-hidden="true" size={22} className={iconClassName} />
      <p className="mt-4 text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm leading-5 text-muted">{detail}</p>
    </div>
  );
}
