import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  FileSearch,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const trustPoints = [
  {
    icon: GraduationCap,
    title: "Verified students",
    copy: "A university-only community.",
  },
  {
    icon: FileSearch,
    title: "Evidence, not guesses",
    copy: "AI reads the actual agreement.",
  },
  {
    icon: ShieldCheck,
    title: "Permission made clear",
    copy: "Know what to ask before listing.",
  },
];

const steps = [
  {
    number: "01",
    title: "Verify",
    body: "Join with your university identity.",
  },
  {
    number: "02",
    title: "Find or list",
    body: "Match a temporary room to exact dates.",
  },
  {
    number: "03",
    title: "Check",
    body: "Analyze the agreement and permission.",
  },
  {
    number: "04",
    title: "Connect",
    body: "Request the room from a verified student.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute -right-36 -top-40 size-[36rem] rounded-full bg-brand-soft/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 size-80 rounded-full bg-ai-soft/60 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="max-w-3xl">
            <Badge tone="success">
              <ShieldCheck aria-hidden="true" size={15} />
              Temporary housing, exclusively for verified students
            </Badge>
            <h1 className="mt-6 max-w-3xl text-[2.7rem] leading-[1.02] font-extrabold tracking-[-0.06em] text-balance sm:text-6xl lg:text-[4.8rem]">
              Your room shouldn&apos;t sit empty while another student can&apos;t find housing.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              RoomRelay matches exchange dates and uses AI to inspect the rental agreement
              before students commit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/listings" className={buttonStyles({ size: "lg" })}>
                <Search aria-hidden="true" size={18} />
                Find a room
              </Link>
              <Link
                href="/list-room"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                List your room
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-muted">
              <span className="flex items-center gap-1.5">
                <BadgeCheck aria-hidden="true" size={15} className="text-brand" />
                University verified
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles aria-hidden="true" size={15} className="text-ai" />
                AI contract evidence
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck2 aria-hidden="true" size={15} className="text-brand" />
                Built for temporary stays
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white p-3 shadow-2xl shadow-ink/12">
              <div className="relative h-64 overflow-hidden rounded-[1.2rem] sm:h-80">
                <Image
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85"
                  alt="Bright furnished student room in Wyck"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/55 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs font-bold tracking-[0.14em] text-white/75 uppercase">
                    Wyck · Maastricht
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">Bright room in Wyck</p>
                </div>
                <p className="absolute bottom-4 right-4 text-xl font-extrabold text-white">
                  €650<span className="text-xs font-medium text-white/70"> / month</span>
                </p>
              </div>

              <div className="grid gap-2 p-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-brand-soft p-4">
                  <p className="flex items-center gap-2 text-xs font-bold text-brand-dark">
                    <Users aria-hidden="true" size={15} />
                    Student to student
                  </p>
                  <p className="mt-2 text-sm font-extrabold">Daniel → Anna</p>
                  <p className="mt-0.5 text-xs text-muted">Exact exchange-date match</p>
                </div>
                <div className="rounded-2xl bg-ai-soft p-4">
                  <p className="flex items-center gap-2 text-xs font-bold text-ai">
                    <Sparkles aria-hidden="true" size={15} />
                    AI contract checked
                  </p>
                  <p className="mt-2 text-sm font-extrabold">Evidence found</p>
                  <p className="mt-0.5 text-xs text-muted">Landlord permission required</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-12 hidden rounded-2xl border border-line bg-white p-3.5 shadow-xl shadow-ink/8 sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <BadgeCheck aria-hidden="true" size={19} />
                </span>
                <div>
                  <p className="text-sm font-extrabold">Daniel is verified</p>
                  <p className="text-xs text-muted">Maastricht University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-4 bg-white px-5 py-6 sm:px-8">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon aria-hidden="true" size={19} />
              </span>
              <div>
                <p className="text-sm font-extrabold">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From empty room to a safer match."
          description="A purpose-built flow for temporary student housing—not another generic rental marketplace."
          action={
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark"
            >
              Browse available rooms
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          }
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group rounded-[1.25rem] border border-line bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl hover:shadow-ink/5"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-canvas text-xs font-extrabold text-brand transition group-hover:bg-brand group-hover:text-white">
                {step.number}
              </span>
              <h3 className="mt-7 text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid overflow-hidden rounded-[1.5rem] border border-ai/15 bg-white lg:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-ai p-7 text-white sm:p-9">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/12">
              <FileSearch aria-hidden="true" size={22} />
            </span>
            <p className="mt-6 text-xs font-bold tracking-[0.16em] text-white/65 uppercase">
              The AI difference
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
              Evidence from the actual contract.
            </h2>
          </div>
          <div className="grid gap-4 p-7 sm:grid-cols-3 sm:p-9">
            {[
              ["01", "Upload", "Your rental agreement stays part of the flow."],
              ["02", "Analyze", "Gemini finds permission terms and restrictions."],
              ["03", "Act", "See exact quotes and practical next steps."],
            ].map(([number, title, copy]) => (
              <div key={number}>
                <p className="text-xs font-extrabold text-ai">{number}</p>
                <p className="mt-3 font-extrabold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
