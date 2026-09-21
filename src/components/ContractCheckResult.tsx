import {
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  CircleX,
  Flag,
  ListChecks,
  Quote,
} from "lucide-react";
import type { ContractCheckResponse } from "@/lib/ai";

interface ContractCheckResultProps {
  result: ContractCheckResponse;
}

export function ContractCheckResult({ result }: ContractCheckResultProps) {
  const statusConfig = {
    safe: {
      label: "Contract appears to allow it",
      icon: CheckCircle2,
      panelClassName: "border-emerald-200 bg-emerald-50/70",
      iconClassName: "bg-emerald-100 text-emerald-700",
      accentClassName: "text-emerald-700",
    },
    permission_required: {
      label: "Landlord permission required",
      icon: CircleAlert,
      panelClassName: "border-amber-200 bg-amber-50/70",
      iconClassName: "bg-amber-100 text-amber-700",
      accentClassName: "text-amber-700",
    },
    problem: {
      label: "Contract restriction found",
      icon: CircleX,
      panelClassName: "border-red-200 bg-red-50/70",
      iconClassName: "bg-red-100 text-red-700",
      accentClassName: "text-red-700",
    },
    unclear: {
      label: "Contract is unclear",
      icon: CircleHelp,
      panelClassName: "border-slate-200 bg-slate-50",
      iconClassName: "bg-slate-200 text-slate-700",
      accentClassName: "text-slate-700",
    },
  }[result.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 ${statusConfig.panelClassName}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl ${statusConfig.iconClassName}`}
        >
          <StatusIcon aria-hidden="true" size={22} />
        </span>
        <div>
          <p
            className={`text-xs font-bold tracking-[0.14em] uppercase ${statusConfig.accentClassName}`}
          >
            Status · {statusConfig.label}
          </p>
          <h3 className="mt-1 text-xl font-bold">{result.title}</h3>
          <p className="mt-2 leading-7 text-ink/70">{result.summary}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/85 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
          <Quote aria-hidden="true" size={16} className={statusConfig.accentClassName} />
          Evidence from your contract
        </p>
        {result.evidence.length > 0 ? (
          <div className="mt-4 space-y-4">
            {result.evidence.map((item, index) => (
              <div key={`${item.quote}-${index}`} className="border-l-2 border-line pl-4">
                <blockquote className="text-sm font-semibold leading-6 text-ink">
                  “{item.quote}”
                </blockquote>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">
            No clear supporting clause was found in the uploaded agreement.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ResultList icon={Flag} title="Flags" items={result.flags} />
        <ResultList icon={ListChecks} title="Next steps" items={result.nextSteps} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
        <p className="text-sm font-bold">
          Confidence:{" "}
          <span className={`capitalize ${statusConfig.accentClassName}`}>
            {result.confidence}
          </span>
        </p>
        <p className="max-w-2xl text-xs leading-5 text-muted">
          RoomRelay analyses the uploaded agreement and does not provide legal advice.
          Always confirm requirements with your landlord or appropriate housing authority.
        </p>
      </div>
    </div>
  );
}

interface ResultListProps {
  icon: typeof Flag;
  title: string;
  items: string[];
}

function ResultList({ icon: Icon, title, items }: ResultListProps) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon aria-hidden="true" size={16} className="text-amber-700" />
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-5 text-muted">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">None identified.</p>
      )}
    </div>
  );
}
