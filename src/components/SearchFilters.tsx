"use client";

import { RotateCcw, Search } from "lucide-react";
import type { ListingFilters } from "@/lib/listing-filters";

export type FilterValues = ListingFilters;

interface SearchFiltersProps {
  values: FilterValues;
  areas: string[];
  onChange: (values: FilterValues) => void;
  onSubmit: () => void;
  onReset: () => void;
  error?: string | null;
}

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm font-semibold text-ink transition focus:border-brand focus:bg-white";

export function SearchFilters({
  values,
  areas,
  onChange,
  onSubmit,
  onReset,
  error,
}: SearchFiltersProps) {
  function updateField(field: keyof FilterValues, value: string) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form
      className="mt-9 rounded-3xl border border-line bg-white p-4 shadow-sm sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.85fr_1fr_auto] lg:items-end">
        <label className="text-xs font-bold tracking-wide text-muted uppercase">
          Move-in date
          <input
            type="date"
            value={values.moveIn}
            max={values.moveOut || undefined}
            aria-invalid={Boolean(error)}
            onChange={(event) => updateField("moveIn", event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className="text-xs font-bold tracking-wide text-muted uppercase">
          Move-out date
          <input
            type="date"
            value={values.moveOut}
            min={values.moveIn || undefined}
            aria-invalid={Boolean(error)}
            onChange={(event) => updateField("moveOut", event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className="text-xs font-bold tracking-wide text-muted uppercase">
          Maximum price
          <div className="relative">
            <span className="absolute left-3 top-1/2 mt-1 -translate-y-1/2 text-sm font-bold text-muted">
              €
            </span>
            <input
              type="number"
              min="0"
              step="25"
              placeholder="Any"
              value={values.maxPrice}
              onChange={(event) => updateField("maxPrice", event.target.value)}
              className={`${fieldClassName} pl-7`}
            />
          </div>
        </label>

        <label className="text-xs font-bold tracking-wide text-muted uppercase">
          Area
          <select
            value={values.area}
            onChange={(event) => updateField("area", event.target.value)}
            className={fieldClassName}
          >
            <option value="">All areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          <Search aria-hidden="true" size={16} />
          Search
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <RotateCcw aria-hidden="true" size={14} />
        Reset filters
      </button>
    </form>
  );
}
