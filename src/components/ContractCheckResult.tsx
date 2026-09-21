import {
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  CircleX,
  Flag,
  ListChecks,
  Quote,
  Sparkles,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { ContractCheckResponse } from "@/lib/ai";

interface ContractCheckResultProps {
  result: ContractCheckResponse;
}

const statusConfig = {
  safe: {
    label: "Contract appears to allow it",
    icon: CheckCircle2,
    tone: "success",
    iconClassName: "bg-brand-soft text-brand",
    borderClassName: "border-brand/20",
  },
  permission_required: {
    label: "Landlord permission required",
    icon: CircleAlert,
    tone: "warning",
    iconClassName: "bg-warning-soft text-warning",
    borderClassName: "border-warning/20",
  },
  problem: {
    label: "Contract restriction found",
    icon: CircleX,
    tone: "danger",
    iconClassName: "bg-danger-soft text-danger",
    borderClassName: "border-danger/20",
  },
  unclear: {
    label: "Contract is unclear",
    icon: CircleHelp,
    tone: "neutral",
    iconClassName: "bg-[#F0F2EF] text-muted",
    borderClassName: "border-line",
  },
} satisfies Record<
  ContractCheckResponse["status"],
  {
    label: string;
    icon: typeof CheckCircle2;
    tone: BadgeTone;
    iconClassName: string;
    borderClassName: string;
  }
>;

export function ContractCheckResult({ result }: ContractCheckResultProps) {
  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <section
      aria-label="AI contract analysis"
      className={`overflow-hidden rounded-[1.5rem] border bg-white ${config.borderClassName}`}
    >
      <div className="border-b border-line bg-raised p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl ${config.iconClassName}`}
            >
              <StatusIcon aria-hidden="true" size={23} />
            </span>
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={config.tone}>{config.label}</Badge>
                <Badge tone="ai">
                  <Sparkles aria-hidden="true" size={13} />
                  AI contract checked
                </Badge>
              </div>
              <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.035em]">
                {result.title}
              </h3>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white px-3 py-2 text-right">
            <p className="text-[0.62rem] font-bold tracking-wide text-muted uppercase">
              Confidence
            </p>
            <p className="mt-0.5 text-sm font-extrabold capitalize">{result.confidence}</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl leading-7 text-muted">{result.summary}</p>
      </div>

      <div className="p-5 sm:p-7">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-ai uppercase">
            <Quote aria-hidden="true" size={15} />
            Evidence from your contract
          </p>
          {result.evidence.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {result.evidence.map((item, index) => (
                <figure
                  key={`${item.quote}-${index}`}
                  className="rounded-[1rem] border border-ai/12 bg-ai-soft/35 p-5"
                >
                  <blockquote className="text-[0.95rem] font-bold leading-7 text-ink">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-3 border-t border-ai/10 pt-3 text-sm leading-6 text-muted">
                    {item.explanation}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-canvas p-4 text-sm leading-6 text-muted">
              No clear supporting clause was found in the uploaded agreement.
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-warning/15 bg-warning-soft/55 p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold text-warning">
              <Flag aria-hidden="true" size={16} />
              Important conditions
            </p>
            <BulletList items={result.flags} />
          </div>
          <div className="rounded-[1rem] border border-line bg-canvas p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold">
              <ListChecks aria-hidden="true" size={16} className="text-brand" />
              Recommended actions
            </p>
            {result.nextSteps.length > 0 ? (
              <ol className="mt-4 space-y-3">
                {result.nextSteps.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white text-[0.65rem] font-extrabold text-brand shadow-sm">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-muted">No specific actions identified.</p>
            )}
          </div>
        </div>
      </div>

      <p className="border-t border-line bg-canvas px-5 py-4 text-xs leading-5 text-muted sm:px-7">
        RoomRelay analyses the uploaded agreement and does not provide legal advice. Always
        confirm requirements with your landlord or appropriate housing authority.
      </p>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return items.length > 0 ? (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-warning" />
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-3 text-sm text-muted">None identified.</p>
  );
}
