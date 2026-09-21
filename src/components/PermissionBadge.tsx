import { CircleAlert, ShieldCheck, Clock3 } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { PermissionStatus } from "@/types";

interface PermissionBadgeProps {
  status: PermissionStatus;
  showUnchecked?: boolean;
}

const badgeConfig = {
  unchecked: {
    label: "Not checked",
    icon: CircleAlert,
    tone: "neutral",
  },
  verified: {
    label: "Permission verified",
    icon: ShieldCheck,
    tone: "success",
  },
  pending: {
    label: "Check pending",
    icon: Clock3,
    tone: "warning",
  },
  permission_required: {
    label: "Landlord permission required",
    icon: CircleAlert,
    tone: "warning",
  },
} satisfies Record<
  PermissionStatus,
  { label: string; icon: typeof CircleAlert; tone: BadgeTone }
>;

export function PermissionBadge({ status, showUnchecked = false }: PermissionBadgeProps) {
  if (status === "unchecked" && !showUnchecked) {
    return null;
  }

  const config = badgeConfig[status];
  const Icon = config.icon;

  return (
    <Badge tone={config.tone} compact>
      <Icon aria-hidden="true" size={14} />
      {config.label}
    </Badge>
  );
}
