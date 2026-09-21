import type { ReactNode } from "react";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "ai";

const tones: Record<BadgeTone, string> = {
  success: "border-brand/15 bg-brand-soft text-brand-dark",
  warning: "border-warning/15 bg-warning-soft text-warning",
  danger: "border-danger/15 bg-danger-soft text-danger",
  neutral: "border-line bg-[#F0F2EF] text-muted",
  ai: "border-ai/15 bg-ai-soft text-ai",
};

export function Badge({
  children,
  tone = "neutral",
  compact = false,
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${tones[tone]} ${
        compact ? "px-2.5 py-1 text-[0.7rem]" : "px-3 py-1.5 text-xs"
      } ${className}`}
    >
      {children}
    </span>
  );
}
