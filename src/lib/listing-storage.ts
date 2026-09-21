"use client";

import { useSyncExternalStore } from "react";
import type { Listing } from "@/types";

export const USER_LISTINGS_STORAGE_KEY = "roomrelay_user_listings";
const LISTINGS_CHANGED_EVENT = "roomrelay-listings-changed";

interface ListingsSnapshot {
  hydrated: boolean;
  listings: Listing[];
}

const serverSnapshot: ListingsSnapshot = {
  hydrated: false,
  listings: [],
};

let cachedRawValue: string | null | undefined;
let cachedSnapshot: ListingsSnapshot = {
  hydrated: true,
  listings: [],
};

function isListing(value: unknown): value is Listing {
  if (!value || typeof value !== "object") return false;

  const listing = value as Partial<Listing>;
  return (
    typeof listing.id === "string" &&
    typeof listing.ownerId === "string" &&
    typeof listing.title === "string" &&
    typeof listing.area === "string" &&
    typeof listing.price === "number" &&
    typeof listing.startDate === "string" &&
    typeof listing.endDate === "string" &&
    typeof listing.description === "string" &&
    typeof listing.furnished === "boolean" &&
    typeof listing.image === "string" &&
    typeof listing.permissionStatus === "string" &&
    typeof listing.published === "boolean"
  );
}

function readClientSnapshot(): ListingsSnapshot {
  try {
    const storedValue = window.localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
    if (storedValue === cachedRawValue) return cachedSnapshot;

    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
    cachedRawValue = storedValue;
    cachedSnapshot = {
      hydrated: true,
      listings: Array.isArray(parsedValue) ? parsedValue.filter(isListing) : [],
    };
    return cachedSnapshot;
  } catch {
    cachedRawValue = undefined;
    cachedSnapshot = { hydrated: true, listings: [] };
    return cachedSnapshot;
  }
}

function subscribeToListings(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LISTINGS_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LISTINGS_CHANGED_EVENT, onStoreChange);
  };
}

export function useUserListings() {
  return useSyncExternalStore(
    subscribeToListings,
    readClientSnapshot,
    () => serverSnapshot,
  );
}

export function getUserListings(): Listing[] {
  return readClientSnapshot().listings;
}

export function saveUserListing(listing: Listing) {
  const currentListings = getUserListings();
  const withoutDuplicate = currentListings.filter((item) => item.id !== listing.id);

  window.localStorage.setItem(
    USER_LISTINGS_STORAGE_KEY,
    JSON.stringify([...withoutDuplicate, listing]),
  );
  window.dispatchEvent(new Event(LISTINGS_CHANGED_EVENT));
}

export function createListingId(title: string) {
  const slug =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "student-room";

  return `${slug}-${Date.now().toString(36)}`;
}
