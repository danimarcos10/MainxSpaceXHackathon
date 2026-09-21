import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const trustPoints = [
  { icon: Users, label: "Student-only community" },
  { icon: GraduationCap, label: "University verification" },
  { icon: Sparkles, label: "AI-powered contract checks" },
  { icon: FileCheck2, label: "Made for temporary stays" },
];

const steps = [
  {
    number: "01",
    title: "Verify you're a student",
    body: "Join a trusted university community.",
  },
  {
    number: "02",
    title: "Find or list a room",
    body: "Match dates that fit student life.",
  },
  {
    number: "03",
    title: "Check the sublet",
    body: "Understand the contract before moving.",
  },
  {
    number: "04",
    title: "Match safely",
    body: "Connect with a verified student.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute -right-36 -top-40 size-[34rem] rounded-full bg-brand-soft blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand-dark">
              <ShieldCheck aria-hidden="true" size={16} />
              Safer temporary housing for students
            </div>
            <h1 className="max-w-3xl text-[2.75rem] leading-[1.04] font-bold tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.6rem]">
              Your room shouldn&apos;t sit empty while another student can&apos;t find housing.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl">
              Verified student-to-student subletting, made safer with AI.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 font-bold text-white shadow-lg shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                <Search aria-hidden="true" size={18} />
                Find a room
              </Link>
              <Link
                href="/list-room"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-7 py-4 font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30"
              >
                List your room
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
            <div className="absolute -left-8 top-14 hidden rounded-2xl border border-line bg-white p-4 shadow-xl shadow-ink/8 sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-brand">
                  <BadgeCheck aria-hidden="true" size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold">Student verified</p>
                  <p className="text-xs text-muted">Maastricht University</p>
                </div>
              </div>
            </div>

            <div className="rotate-1 rounded-[2rem] border border-line bg-white p-3 shadow-2xl shadow-ink/12">
              <div
                className="h-64 rounded-[1.45rem] bg-cover bg-center sm:h-80"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85')",
                }}
                role="img"
                aria-label="Bright furnished student room in Wyck"
              />
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                      Wyck · Maastricht
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight">
                      Bright room in Wyck
                    </h2>
                  </div>
                  <p className="whitespace-nowrap text-lg font-bold">
                    €650<span className="text-xs font-normal text-muted">/mo</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-brand-soft px-3 py-1.5 text-brand-dark">
                    Permission checked
                  </span>
                  <span className="rounded-full bg-[#f1f2ef] px-3 py-1.5">Oct 1 — Jan 31</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line px-0 sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 bg-white px-5 py-6 sm:px-7">
              <Icon aria-hidden="true" className="shrink-0 text-brand" size={20} />
              <span className="text-sm font-semibold leading-5">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-brand uppercase">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              From empty room to safe match.
            </h2>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark"
          >
            Browse available rooms
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
            >
              <span className="text-sm font-bold text-brand">{step.number}</span>
              <h3 className="mt-8 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
