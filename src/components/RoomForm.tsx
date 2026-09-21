"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  Home,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { ContractCheckResult } from "@/components/ContractCheckResult";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  checkContract,
  generateLandlordRequest,
  type ContractCheckResponse,
  type LandlordRequestResponse,
} from "@/lib/ai";
import { createListingId, saveUserListing } from "@/lib/listing-storage";
import type { Listing } from "@/types";

const photoOptions = [
  {
    label: "Bright bedroom",
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=85",
  },
  {
    label: "Modern bedroom",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
  },
  {
    label: "Cosy bedroom",
    url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1400&q=85",
  },
];

const steps = [
  { number: 1, label: "Room details", icon: Home },
  { number: 2, label: "Availability", icon: FileText },
  { number: 3, label: "Student", icon: GraduationCap },
  { number: 4, label: "Contract check", icon: ShieldCheck },
];

const inputClassName =
  "mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink transition placeholder:text-muted/60 focus:border-brand focus:bg-white";

export function RoomForm() {
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState({
    title: "Bright room in Wyck",
    area: "Wyck",
    price: "650",
    description:
      "A calm, sun-filled room in a shared student apartment, a short walk from Maastricht station and the city centre. Fully furnished and ready for a four-month stay.",
    furnished: true,
    image: photoOptions[0].url,
    startDate: "2026-10-01",
    endDate: "2027-01-31",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [contractResult, setContractResult] = useState<ContractCheckResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [landlordRequest, setLandlordRequest] =
    useState<LandlordRequestResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [approved, setApproved] = useState(false);
  const [publishedListing, setPublishedListing] = useState<Listing | null>(null);

  function updateRoom(field: string, value: string | boolean) {
    setRoom((current) => ({ ...current, [field]: value }));
  }

  async function runContractCheck() {
    if (!uploadedFile) {
      setAnalysisError("Please choose a PDF rental agreement first.");
      return;
    }

    setChecking(true);
    setAnalysisError(null);
    try {
      setContractResult(await checkContract(uploadedFile));
    } catch (error) {
      setContractResult(null);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "The rental agreement could not be analyzed. Please retry.",
      );
    } finally {
      setChecking(false);
    }
  }

  function selectContractFile(file: File | undefined) {
    setAnalysisError(null);
    setContractResult(null);

    if (!file) {
      setUploadedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadedFile(null);
      setAnalysisError("Only PDF rental agreements are supported.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadedFile(null);
      setAnalysisError("The PDF must be 20 MB or smaller.");
      return;
    }

    setUploadedFile(file);
  }

  async function runLandlordRequest() {
    setGenerating(true);
    try {
      setLandlordRequest(await generateLandlordRequest());
    } finally {
      setGenerating(false);
    }
  }

  function publishListing() {
    const listing: Listing = {
      id: createListingId(room.title),
      ownerId: "daniel",
      title: room.title,
      area: room.area,
      price: Number(room.price),
      startDate: room.startDate,
      endDate: room.endDate,
      description: room.description,
      furnished: room.furnished,
      image: room.image,
      permissionStatus: "verified",
      published: true,
    };

    saveUserListing(listing);
    setPublishedListing(listing);
  }

  if (publishedListing) {
    return <ListingSuccess listing={publishedListing} />;
  }

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl shadow-ink/5 lg:grid-cols-[18rem_1fr]">
      <aside className="bg-ink p-7 text-white sm:p-8">
        <p className="text-sm font-bold tracking-[0.16em] text-[#8ed9bc] uppercase">
          List your room
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.035em]">
          Four quick steps to a safer sublet.
        </h1>
        <ol className="mt-8 grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-3">
          {steps.map(({ number, label, icon: Icon }) => {
            const complete = step > number;
            const active = step === number;
            return (
              <li
                key={number}
                className={`flex items-center gap-3 rounded-2xl p-2.5 transition lg:p-3 ${
                  active ? "bg-white/10" : ""
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full ${
                    complete
                      ? "bg-brand text-white"
                      : active
                        ? "bg-white text-ink"
                        : "bg-white/8 text-white/50"
                  }`}
                >
                  {complete ? (
                    <Check aria-hidden="true" size={16} strokeWidth={3} />
                  ) : (
                    <Icon aria-hidden="true" size={16} />
                  )}
                </span>
                <span
                  className={`hidden text-sm font-semibold lg:block ${
                    active || complete ? "text-white" : "text-white/45"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="p-6 sm:p-10 lg:p-12">
        {step === 1 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep(2);
            }}
          >
            <StepHeading
              eyebrow="Step 1 of 4"
              title="Tell us about your room"
              description="These details will become your marketplace listing."
            />

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold sm:col-span-2">
                Listing title
                <input
                  required
                  value={room.title}
                  onChange={(event) => updateRoom("title", event.target.value)}
                  className={inputClassName}
                />
              </label>
              <label className="text-sm font-bold">
                Area
                <select
                  required
                  value={room.area}
                  onChange={(event) => updateRoom("area", event.target.value)}
                  className={inputClassName}
                >
                  {["Wyck", "Randwyck", "City Centre", "Mariaberg", "Sint Pieter"].map(
                    (area) => (
                      <option key={area}>{area}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="text-sm font-bold">
                Monthly price
                <div className="relative">
                  <span className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 font-bold text-muted">
                    €
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={room.price}
                    onChange={(event) => updateRoom("price", event.target.value)}
                    className={`${inputClassName} pl-8`}
                  />
                </div>
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Description
                <textarea
                  required
                  rows={4}
                  value={room.description}
                  onChange={(event) => updateRoom("description", event.target.value)}
                  className={inputClassName}
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold">Is the room furnished?</legend>
              <div className="mt-2 flex gap-3">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => updateRoom("furnished", value)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                      room.furnished === value
                        ? "bg-brand text-white"
                        : "border border-line bg-white text-muted hover:text-ink"
                    }`}
                  >
                    {value ? "Yes, furnished" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="text-sm font-bold">Choose a demo photo</legend>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {photoOptions.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    aria-label={photo.label}
                    aria-pressed={room.image === photo.url}
                    onClick={() => updateRoom("image", photo.url)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition ${
                      room.image === photo.url ? "border-brand" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.label}
                      fill
                      sizes="(max-width: 640px) 30vw, 180px"
                      className="object-cover"
                    />
                    {room.image === photo.url && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-brand text-white">
                        <Check aria-hidden="true" size={13} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <StepFooter onBack={null} />
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep(3);
            }}
          >
            <StepHeading
              eyebrow="Step 2 of 4"
              title="When is it available?"
              description="Choose the full period a student can stay in your room."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Start date
                <input
                  required
                  type="date"
                  max={room.endDate}
                  value={room.startDate}
                  onChange={(event) => updateRoom("startDate", event.target.value)}
                  className={inputClassName}
                />
              </label>
              <label className="text-sm font-bold">
                End date
                <input
                  required
                  type="date"
                  min={room.startDate}
                  value={room.endDate}
                  onChange={(event) => updateRoom("endDate", event.target.value)}
                  className={inputClassName}
                />
              </label>
            </div>
            <div className="mt-7 rounded-2xl bg-brand-soft p-5">
              <p className="text-sm font-bold text-brand-dark">Great fit for exchange students</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Daniel&apos;s dates cover the October–January exchange semester.
              </p>
            </div>
            <StepFooter onBack={() => setStep(1)} />
          </form>
        )}

        {step === 3 && (
          <div>
            <StepHeading
              eyebrow="Step 3 of 4"
              title="Your student details"
              description="RoomRelay is a verified student-only community."
            />
            <div className="mt-8 rounded-3xl border border-line bg-canvas p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full bg-ink text-xl font-bold text-white">
                    D
                  </span>
                  <div>
                    <p className="text-xl font-bold">Daniel</p>
                    <p className="mt-0.5 text-sm text-muted">Maastricht University</p>
                    <p className="mt-0.5 text-sm text-muted">
                      daniel@student.maastrichtuniversity.nl
                    </p>
                  </div>
                </div>
                <VerificationBadge />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-soft p-4 text-sm font-semibold text-brand-dark">
              <BadgeCheck aria-hidden="true" size={20} />
              Your university email and student status are verified.
            </div>
            <StepFooter onBack={() => setStep(2)} onNext={() => setStep(4)} />
          </div>
        )}

        {step === 4 && (
          <div>
            <StepHeading
              eyebrow="Step 4 of 4"
              title="Before listing your room, let's check your rental agreement."
              description="Our contract check highlights what you need before temporarily subletting."
            />

            {!contractResult && (
              <>
                <div className="mt-8 rounded-3xl border-2 border-dashed border-line bg-canvas p-7 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-brand shadow-sm">
                    <Upload aria-hidden="true" size={22} />
                  </span>
                  <p className="mt-4 font-bold">Upload rental agreement</p>
                  <p className="mt-1 text-sm text-muted">PDF up to 20 MB.</p>
                  <div className="mt-5 flex justify-center">
                    <label className="cursor-pointer rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold transition hover:border-brand/30">
                      Choose PDF
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={checking}
                        className="sr-only"
                        onChange={(event) =>
                          selectContractFile(event.target.files?.[0])
                        }
                      />
                    </label>
                  </div>
                  {uploadedFile && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-dark">
                      <FileCheck2 aria-hidden="true" size={16} />
                      {uploadedFile.name}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!uploadedFile || checking}
                  onClick={runContractCheck}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {checking ? (
                    <>
                      <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
                      Analyzing your rental agreement...
                    </>
                  ) : (
                    <>
                      <Sparkles aria-hidden="true" size={18} />
                      Check my contract
                    </>
                  )}
                </button>

                {analysisError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                  >
                    {analysisError}
                  </div>
                )}
              </>
            )}

            {contractResult && (
              <div className="mt-8">
                <ContractCheckResult result={contractResult} />

                {!landlordRequest && (
                  <button
                    type="button"
                    disabled={generating}
                    onClick={runLandlordRequest}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white transition hover:bg-brand disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />
                        Writing request...
                      </>
                    ) : (
                      <>
                        <Mail aria-hidden="true" size={18} />
                        Generate landlord request
                      </>
                    )}
                  </button>
                )}

                {landlordRequest && (
                  <div className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-brand">
                      <Sparkles aria-hidden="true" size={17} />
                      Generated landlord email
                    </div>
                    <p className="mt-5 text-xs font-bold tracking-wide text-muted uppercase">
                      Subject
                    </p>
                    <p className="mt-1 font-bold">{landlordRequest.subject}</p>
                    <div className="mt-4 rounded-2xl bg-canvas p-4 text-sm leading-7 text-muted">
                      {landlordRequest.message}
                    </div>

                    {!approved ? (
                      <button
                        type="button"
                        onClick={() => setApproved(true)}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-6 py-3 font-bold text-brand-dark transition hover:bg-brand hover:text-white"
                      >
                        <CheckCircle2 aria-hidden="true" size={18} />
                        Simulate landlord approval
                      </button>
                    ) : (
                      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand-soft p-4 font-bold text-brand-dark">
                        <CheckCircle2 aria-hidden="true" size={20} />
                        Landlord permission verified
                      </div>
                    )}
                  </div>
                )}

                {approved && (
                  <button
                    type="button"
                    onClick={publishListing}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-bold text-white shadow-lg shadow-brand/15 transition hover:bg-brand-dark"
                  >
                    Publish listing
                    <ArrowRight aria-hidden="true" size={18} />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

function StepHeading({ eyebrow, title, description }: StepHeadingProps) {
  return (
    <div>
      <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
      <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p>
    </div>
  );
}

interface StepFooterProps {
  onBack: (() => void) | null;
  onNext?: () => void;
}

function StepFooter({ onBack, onNext }: StepFooterProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type={onNext ? "button" : "submit"}
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
      >
        Continue
        <ArrowRight aria-hidden="true" size={16} />
      </button>
    </div>
  );
}

function ListingSuccess({ listing }: { listing: Listing }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl shadow-ink/5">
      <div className="bg-brand-soft px-6 py-10 text-center sm:px-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand text-white">
          <Check aria-hidden="true" size={27} strokeWidth={3} />
        </span>
        <p className="mt-5 text-sm font-bold tracking-[0.15em] text-brand uppercase">
          Listing complete
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em]">
          Your room is ready for RoomRelay
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Daniel&apos;s room is published and ready to match with an incoming student.
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.85fr]">
        <div className="overflow-hidden rounded-3xl border border-line">
          <div className="relative aspect-[16/9]">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                  {listing.area}
                </p>
                <h2 className="mt-1 text-2xl font-bold">{listing.title}</h2>
              </div>
              <p className="text-xl font-bold">
                €{listing.price}
                <span className="text-xs font-normal text-muted"> / month</span>
              </p>
            </div>
            <p className="mt-3 text-sm text-muted">
              {listing.startDate} – {listing.endDate}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to match</h2>
          <ul className="mt-5 space-y-3">
            {[
              "Student verified",
              "Listing information",
              "Contract checked",
              "Landlord permission",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3 text-sm font-bold"
              >
                {item}
                <CheckCircle2 aria-label="Complete" size={19} className="text-brand" />
              </li>
            ))}
          </ul>
          <Link
            href="/listings"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
          >
            View in marketplace
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>

      <p className="border-t border-line bg-ink px-6 py-5 text-center text-sm font-semibold text-white/85">
        One student was paying for an empty room. Another couldn&apos;t find housing. RoomRelay
        matched them safely.
      </p>
    </div>
  );
}
