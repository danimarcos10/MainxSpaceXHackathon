"use client";

import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldLabel, fieldControlStyles } from "@/components/ui/Field";
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
      className="mt-9 rounded-[1.5rem] border border-line bg-white p-4 shadow-xl shadow-ink/[0.04] sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_1fr_auto] lg:items-end">
        <FieldLabel>
          Move-in date
          <input
            type="date"
            value={values.moveIn}
            max={values.moveOut || undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "filter-error" : undefined}
            onChange={(event) => updateField("moveIn", event.target.value)}
            className={`${fieldControlStyles} h-12 py-0 normal-case tracking-normal`}
          />
        </FieldLabel>

        <FieldLabel>
          Move-out date
          <input
            type="date"
            value={values.moveOut}
            min={values.moveIn || undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "filter-error" : undefined}
            onChange={(event) => updateField("moveOut", event.target.value)}
            className={`${fieldControlStyles} h-12 py-0 normal-case tracking-normal`}
          />
        </FieldLabel>

        <FieldLabel>
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
              className={`${fieldControlStyles} h-12 py-0 pl-7 normal-case tracking-normal`}
            />
          </div>
        </FieldLabel>

        <FieldLabel>
          Area
          <select
            value={values.area}
            onChange={(event) => updateField("area", event.target.value)}
            className={`${fieldControlStyles} h-12 py-0 normal-case tracking-normal`}
          >
            <option value="">All areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </FieldLabel>

        <Button
          type="submit"
          className="w-full lg:w-auto"
        >
          <Search aria-hidden="true" size={16} />
          Search
        </Button>
      </div>

      {error && (
        <p id="filter-error" role="alert" className="mt-4 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={onReset}
        variant="ghost"
        size="sm"
        className="mt-2 -ml-3"
      >
        <RotateCcw aria-hidden="true" size={14} />
        Reset filters
      </Button>
    </form>
  );
}
