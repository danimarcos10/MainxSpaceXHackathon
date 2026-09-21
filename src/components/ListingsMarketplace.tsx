"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { SearchFilters, type FilterValues } from "@/components/SearchFilters";
import { getUserById, listings } from "@/lib/demo-data";
import {
  filterListings,
  validateListingFilters,
} from "@/lib/listing-filters";
import { useUserListings } from "@/lib/listing-storage";
import type { Listing } from "@/types";

const emptyFilters: FilterValues = {
  moveIn: "",
  moveOut: "",
  maxPrice: "",
  area: "",
};

export function ListingsMarketplace() {
  const [draftFilters, setDraftFilters] = useState<FilterValues>(emptyFilters);
  const [activeFilters, setActiveFilters] = useState<FilterValues>(emptyFilters);
  const [filterError, setFilterError] = useState<string | null>(null);
  const { listings: userListings } = useUserListings();

  const publishedListings = useMemo(() => {
    const mergedListings = new Map<string, Listing>();

    [...userListings, ...listings]
      .filter((listing) => listing.published)
      .forEach((listing) => mergedListings.set(listing.id, listing));

    return [...mergedListings.values()];
  }, [userListings]);

  const areas = useMemo(
    () => [...new Set(publishedListings.map((listing) => listing.area))].sort(),
    [publishedListings],
  );

  const filteredListings = useMemo(
    () => filterListings(publishedListings, activeFilters),
    [activeFilters, publishedListings],
  );

  function applyFilters() {
    const validationError = validateListingFilters(draftFilters);
    setFilterError(validationError);

    if (!validationError) {
      setActiveFilters(draftFilters);
    }
  }

  function resetFilters() {
    setDraftFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setFilterError(null);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold tracking-[0.16em] text-brand uppercase">
            Maastricht, Netherlands
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            Rooms that match student life.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Temporary, furnished stays from verified university students.
          </p>
        </div>
        <p aria-live="polite" className="text-sm font-semibold text-muted">
          {filteredListings.length} {filteredListings.length === 1 ? "room" : "rooms"} available
        </p>
      </div>

      <SearchFilters
        values={draftFilters}
        areas={areas}
        onChange={(values) => {
          setDraftFilters(values);
          setFilterError(null);
        }}
        onSubmit={applyFilters}
        onReset={resetFilters}
        error={filterError}
      />

      {filteredListings.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              owner={getUserById(listing.ownerId)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
            <SearchX aria-hidden="true" size={22} />
          </span>
          <h2 className="mx-auto mt-5 max-w-lg text-xl font-bold">
            No rooms match those dates. Try changing your dates, budget or area.
          </h2>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand"
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
