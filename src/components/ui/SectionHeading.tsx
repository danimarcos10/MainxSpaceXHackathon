import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col justify-between gap-5 sm:flex-row sm:items-end ${className}`}>
      <div>
        {eyebrow && (
          <p className="text-xs font-bold tracking-[0.16em] text-brand uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
