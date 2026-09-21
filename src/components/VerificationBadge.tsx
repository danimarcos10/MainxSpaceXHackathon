import { BadgeCheck } from "lucide-react";

interface VerificationBadgeProps {
  label?: string;
  compact?: boolean;
}

export function VerificationBadge({
  label = "Verified student",
  compact = false,
}: VerificationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand-soft font-semibold text-brand-dark ${
        compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      <BadgeCheck aria-hidden="true" size={compact ? 14 : 16} />
      {label}
    </span>
  );
}
