import { CircleAlert, CircleCheck, Clock3 } from "lucide-react";
import type { PermissionStatus } from "@/types";

interface PermissionBadgeProps {
  status: PermissionStatus;
  showUnchecked?: boolean;
}

const badgeConfig = {
  unchecked: {
    label: "Not checked",
    icon: CircleAlert,
    className: "bg-slate-100 text-slate-700",
  },
  verified: {
    label: "Permission checked",
    icon: CircleCheck,
    className: "bg-brand-soft text-brand-dark",
  },
  pending: {
    label: "Check pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-800",
  },
  permission_required: {
    label: "Permission required",
    icon: CircleAlert,
    className: "bg-amber-50 text-amber-800",
  },
} as const;

export function PermissionBadge({ status, showUnchecked = false }: PermissionBadgeProps) {
  if (status === "unchecked" && !showUnchecked) {
    return null;
  }

  const config = badgeConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon aria-hidden="true" size={14} />
      {config.label}
    </span>
  );
}
