import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VerificationBadgeProps {
  label?: string;
  compact?: boolean;
}

export function VerificationBadge({
  label = "Verified student",
  compact = false,
}: VerificationBadgeProps) {
  return (
    <Badge tone="success" compact={compact}>
      <BadgeCheck aria-hidden="true" size={compact ? 14 : 16} />
      {label}
    </Badge>
  );
}
