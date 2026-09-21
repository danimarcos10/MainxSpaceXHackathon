import type { ReactNode } from "react";

export const fieldControlStyles =
  "mt-2 w-full rounded-[0.875rem] border border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink transition placeholder:text-subtle focus:border-brand focus:bg-white";

export function FieldLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`text-xs font-bold tracking-[0.08em] text-muted uppercase ${className}`}>
      {children}
    </label>
  );
}
