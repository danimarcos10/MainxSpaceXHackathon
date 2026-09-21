import type { Listing } from "@/types";

export interface ListingFilters {
  moveIn: string;
  moveOut: string;
  maxPrice: string;
  area: string;
}

export function validateListingFilters(filters: ListingFilters) {
  if (filters.moveIn && filters.moveOut && filters.moveOut < filters.moveIn) {
    return "Move-out date cannot be before move-in date.";
  }

  return null;
}

export function filterListings(
  listings: Listing[],
  filters: ListingFilters,
) {
  const maximumPrice = filters.maxPrice
    ? Number(filters.maxPrice)
    : null;

  return listings.filter((listing) => {
    // ISO date-only strings sort chronologically, avoiding timezone conversion.
    const coversMoveIn =
      !filters.moveIn ||
      (listing.startDate <= filters.moveIn &&
        listing.endDate >= filters.moveIn);
    const coversMoveOut =
      !filters.moveOut ||
      (listing.startDate <= filters.moveOut &&
        listing.endDate >= filters.moveOut);
    const withinBudget =
      maximumPrice === null ||
      (Number.isFinite(maximumPrice) && listing.price <= maximumPrice);
    const matchesArea = !filters.area || listing.area === filters.area;

    return coversMoveIn && coversMoveOut && withinBudget && matchesArea;
  });
}
