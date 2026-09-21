"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  FileCheck2,
  FileSearch,
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
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fieldControlStyles } from "@/components/ui/Field";
import {
  checkContract,
  generateLandlordRequest,
  type ContractCheckResponse,
  type LandlordRequestResponse,
} from "@/lib/ai";
import { compressImage } from "@/lib/image-upload";
import { createListingId, saveUserListing } from "@/lib/listing-storage";
import type { Listing } from "@/types";

const photoOptions = [
  {
    label: "Room with a study desk",
    url: "https://images.unsplash.com/photo-1721396104614-e71110629a2f?auto=format&fit=crop&w=1400&q=82",
  },
  {
    label: "Simple dorm room",
    url: "https://images.unsplash.com/photo-1572496973076-dc34056ceb87?auto=format&fit=crop&w=1400&q=82",
  },
  {
    label: "Small furnished bedroom",
    url: "https://images.unsplash.com/photo-1652882860902-7c6b0f88ef23?auto=format&fit=crop&w=1400&q=82",
  },
];

const steps = [
  { number: 1, label: "Room", icon: Home },
  { number: 2, label: "Dates", icon: CalendarDays },
  { number: 3, label: "Verification", icon: GraduationCap },
  { number: 4, label: "Contract", icon: ShieldCheck },
];

const inputClassName =
  `${fieldControlStyles} font-medium`;

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
  const [photoFilename, setPhotoFilename] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [compressingPhoto, setCompressingPhoto] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  function updateRoom(field: string, value: string | boolean) {
    setRoom((current) => ({ ...current, [field]: value }));
  }

  function selectDemoPhoto(url: string) {
    updateRoom("image", url);
    setPhotoFilename(null);
    setPhotoError(null);
  }

  async function selectPhotoFile(file: File | undefined) {
    if (!file) return;

    setPhotoError(null);
    setCompressingPhoto(true);

    try {
      const image = await compressImage(file);
      updateRoom("image", image);
      setPhotoFilename(file.name);
    } catch (error) {
      setPhotoError(
        error instanceof Error
          ? error.message
          : "The photo could not be prepared. Please try another image.",
      );
    } finally {
      setCompressingPhoto(false);
    }
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
    setPublishError(null);
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

    try {
      saveUserListing(listing);
      setPublishedListing(listing);
    } catch {
      setPublishError(
        "This browser could not save the listing and photo. Free some browser storage or choose a demo photo, then retry.",
      );
    }
  }

  if (publishedListing) {
    return <ListingSuccess listing={publishedListing} />;
  }

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-xl shadow-ink/[0.05] lg:grid-cols-[18rem_1fr]">
      <aside className="bg-ink p-5 text-white sm:p-7 lg:p-8">
        <p className="text-xs font-bold tracking-[0.16em] text-[#A9D9C6] uppercase">
          List your room
        </p>
        <h1 className="mt-3 hidden text-2xl font-extrabold tracking-[-0.035em] text-balance lg:block">
          Four quick steps to a safer sublet.
        </h1>
        <ol className="mt-5 grid grid-cols-4 gap-2 lg:mt-8 lg:grid-cols-1 lg:gap-3">
          {steps.map(({ number, label, icon: Icon }) => {
            const complete = step > number;
            const active = step === number;
            return (
              <li
                key={number}
                className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl p-2 transition lg:flex-row lg:gap-3 lg:p-3 ${
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
                  aria-current={active ? "step" : undefined}
                  className={`max-w-full truncate text-[0.62rem] font-bold lg:text-sm ${
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
                    aria-pressed={room.furnished === value}
                    onClick={() => updateRoom("furnished", value)}
                    className={`rounded-[0.875rem] px-5 py-2.5 text-sm font-bold transition ${
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
              <legend className="text-sm font-bold">Choose a cover photo</legend>
              <p className="mt-1 text-sm text-muted">
                Pick a realistic demo room or add one photo of your own.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photoOptions.map((photo) => (
                  <button
                    key={photo.url}
                    type="button"
                    aria-label={photo.label}
                    aria-pressed={room.image === photo.url}
                    onClick={() => selectDemoPhoto(photo.url)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-[1rem] border-2 transition ${
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
                <label
                  htmlFor="cover-photo"
                  aria-label={photoFilename ? "Change uploaded cover photo" : "Upload your own photo"}
                  className={`relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1rem] border-2 transition ${
                    photoFilename
                      ? "border-brand"
                      : "border-dashed border-brand/35 bg-brand-soft/45 hover:border-brand"
                  }`}
                >
                  {photoFilename ? (
                    <>
                      <Image
                        src={room.image}
                        alt="Your uploaded cover photo"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 180px"
                        className="object-cover"
                      />
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-brand text-white">
                        <Check aria-hidden="true" size={13} strokeWidth={3} />
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-2 px-2 text-center text-xs font-bold text-brand-dark">
                      {compressingPhoto ? (
                        <LoaderCircle aria-hidden="true" size={22} className="animate-spin" />
                      ) : (
                        <Upload aria-hidden="true" size={22} />
                      )}
                      {compressingPhoto ? "Preparing photo…" : "Upload your own"}
                    </span>
                  )}
                </label>
              </div>
              <input
                id="cover-photo"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                disabled={compressingPhoto}
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  void selectPhotoFile(file);
                }}
              />
              {photoFilename && (
                <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-brand/15 bg-brand-soft/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{photoFilename}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Compressed to WebP · stored only in this browser for the MVP
                    </p>
                  </div>
                  <label
                    htmlFor="cover-photo"
                    className="shrink-0 cursor-pointer text-sm font-bold text-brand hover:text-brand-dark"
                  >
                    Change photo
                  </label>
                </div>
              )}
              {photoError && (
                <p
                  role="alert"
                  className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  {photoError}
                </p>
              )}
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
            <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-brand/15 bg-brand-soft/60">
              <div className="flex items-center gap-2 border-b border-brand/10 px-6 py-3 text-xs font-bold text-brand-dark">
                <ShieldCheck aria-hidden="true" size={15} />
                Identity checkpoint complete
              </div>
              <div className="p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-ink text-xl font-bold text-white">
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
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-muted">
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
              title="Check your rental agreement"
              description="AI finds the clauses, evidence and permission requirements that matter before you publish."
            />

            <ContractProgress
              uploaded={Boolean(uploadedFile)}
              analyzed={Boolean(contractResult)}
              approved={approved}
            />

            {!contractResult && (
              <>
                <div
                  aria-busy={checking}
                  className="mt-6 rounded-[1.25rem] border-2 border-dashed border-ai/20 bg-ai-soft/35 p-7 text-center"
                >
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-ai shadow-sm">
                    <Upload aria-hidden="true" size={22} />
                  </span>
                  <p className="mt-4 font-bold">Upload rental agreement</p>
                  <p className="mt-1 text-sm text-muted">PDF up to 20 MB.</p>
                  <div className="mt-5 flex justify-center">
                    <label className="cursor-pointer rounded-[0.875rem] border border-line bg-white px-5 py-2.5 text-sm font-bold transition hover:border-ai/30">
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
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ai/10 bg-white px-3 py-1.5 text-sm font-semibold text-ai">
                      <FileCheck2 aria-hidden="true" size={16} />
                      {uploadedFile.name}
                    </p>
                  )}
                </div>

                {checking ? (
                  <AnalysisLoading filename={uploadedFile?.name ?? "Rental agreement.pdf"} />
                ) : (
                  <Button
                    type="button"
                    disabled={!uploadedFile}
                    onClick={runContractCheck}
                    size="lg"
                    className="mt-6 w-full"
                  >
                    <Sparkles aria-hidden="true" size={18} />
                    Check my contract
                  </Button>
                )}

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
                  <Button
                    type="button"
                    disabled={generating}
                    onClick={runLandlordRequest}
                    variant="dark"
                    size="lg"
                    className="mt-5 w-full"
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
                  </Button>
                )}

                {landlordRequest && (
                  <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-line bg-canvas px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand">
                        <Mail aria-hidden="true" size={17} />
                        Landlord request ready
                      </div>
                      <Badge tone="ai">
                        <Sparkles aria-hidden="true" size={13} />
                        AI drafted
                      </Badge>
                    </div>
                    <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold tracking-wide text-muted uppercase">
                      Subject
                    </p>
                    <p className="mt-1 font-bold">{landlordRequest.subject}</p>
                    <div className="mt-4 rounded-2xl bg-canvas p-4 text-sm leading-7 text-muted">
                      {landlordRequest.message}
                    </div>

                    {!approved ? (
                      <Button
                        type="button"
                        onClick={() => setApproved(true)}
                        variant="secondary"
                        className="mt-5 w-full border-brand/25 bg-brand-soft text-brand-dark"
                      >
                        <CheckCircle2 aria-hidden="true" size={18} />
                        Simulate landlord approval
                      </Button>
                    ) : (
                      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand-soft p-4 font-bold text-brand-dark">
                        <CheckCircle2 aria-hidden="true" size={20} />
                        Landlord permission verified
                      </div>
                    )}
                    </div>
                  </div>
                )}

                {approved && (
                  <>
                    <Button
                      type="button"
                      onClick={publishListing}
                      size="lg"
                      className="mt-6 w-full"
                    >
                      Publish listing
                      <ArrowRight aria-hidden="true" size={18} />
                    </Button>
                    {publishError && (
                      <p
                        role="alert"
                        className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                      >
                        {publishError}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            <Button
              type="button"
              onClick={() => setStep(3)}
              variant="ghost"
              size="sm"
              className="mt-6 -ml-3"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Back
            </Button>
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
      <p className="text-xs font-bold tracking-[0.15em] text-brand uppercase">{eyebrow}</p>
      <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] text-balance sm:text-4xl">
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
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="-ml-3"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={onNext ? "button" : "submit"}
        onClick={onNext}
      >
        Continue
        <ArrowRight aria-hidden="true" size={16} />
      </Button>
    </div>
  );
}

function ContractProgress({
  uploaded,
  analyzed,
  approved,
}: {
  uploaded: boolean;
  analyzed: boolean;
  approved: boolean;
}) {
  const items = [
    { label: "Upload", complete: uploaded },
    { label: "AI review", complete: analyzed },
    { label: "Permission", complete: approved },
    { label: "Publish", complete: false },
  ];

  return (
    <ol className="mt-7 grid grid-cols-4 gap-2" aria-label="Contract and permission progress">
      {items.map((item, index) => {
        const active =
          !item.complete && (index === 0 || items[index - 1]?.complete);
        return (
          <li key={item.label} className="min-w-0">
            <div
              className={`h-1 rounded-full ${
                item.complete ? "bg-brand" : active ? "bg-ai" : "bg-line"
              }`}
            />
            <p
              className={`mt-2 truncate text-[0.65rem] font-bold ${
                item.complete || active ? "text-ink" : "text-subtle"
              }`}
            >
              {item.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function AnalysisLoading({ filename }: { filename: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 overflow-hidden rounded-[1.25rem] border border-ai/20 bg-ai-soft/55 p-6"
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
        <div className="relative grid h-24 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-ai/20 bg-white text-ai shadow-sm">
          <FileSearch aria-hidden="true" size={30} />
          <span
            aria-hidden="true"
            className="contract-scan-line absolute inset-x-2 top-2 h-0.5 rounded-full bg-ai shadow-[0_0_12px_rgba(85,87,201,0.65)]"
          />
        </div>
        <div className="mt-5 sm:ml-6 sm:mt-0">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <LoaderCircle aria-hidden="true" size={17} className="animate-spin text-ai" />
            <p className="font-extrabold">Analyzing your rental agreement</p>
          </div>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
            Looking for subletting clauses, permission requirements and restrictions.
            This can take a few seconds.
          </p>
          <p className="mt-3 truncate text-xs font-bold text-ai">{filename}</p>
        </div>
      </div>
    </div>
  );
}

function ListingSuccess({ listing }: { listing: Listing }) {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const dates = `${dateFormatter.format(
    new Date(`${listing.startDate}T00:00:00Z`),
  )} – ${dateFormatter.format(new Date(`${listing.endDate}T00:00:00Z`))}`;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-xl shadow-ink/[0.05]">
      <div className="relative overflow-hidden bg-brand-soft px-6 py-10 text-center sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl"
        />
        <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20">
          <Check aria-hidden="true" size={27} strokeWidth={3} />
        </span>
        <p className="relative mt-5 text-xs font-bold tracking-[0.15em] text-brand uppercase">
          Published successfully
        </p>
        <h1 className="relative mt-2 text-4xl font-extrabold tracking-[-0.05em] text-balance">
          Your room is ready to match
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-muted">
          The listing is live with its student identity, contract check and permission status.
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.85fr]">
        <div className="overflow-hidden rounded-[1.25rem] border border-line">
          <div className="relative aspect-[16/9]">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              unoptimized={listing.image.startsWith("data:image/")}
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">
                <BadgeCheck aria-hidden="true" size={13} />
                Verified student
              </Badge>
              <Badge tone="ai">
                <Sparkles aria-hidden="true" size={13} />
                AI checked
              </Badge>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mt-4 text-xs font-bold tracking-[0.12em] text-brand uppercase">
                  {listing.area}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold">{listing.title}</h2>
              </div>
              <p className="mt-4 text-xl font-extrabold">
                €{listing.price}
                <span className="text-xs font-medium text-muted"> / month</span>
              </p>
            </div>
            <p className="mt-3 text-sm font-semibold text-muted">{dates}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
            Trust receipt
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
            Everything checked for launch
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              "Student verified",
              "Listing information",
              "Contract checked",
              "Landlord permission",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-[0.875rem] border border-line bg-canvas px-4 py-3 text-sm font-bold"
              >
                {item}
                <CheckCircle2 aria-label="Complete" size={19} className="text-brand" />
              </li>
            ))}
          </ul>
          <Link
            href="/listings"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[0.875rem] bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            View in marketplace
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>

      <p className="border-t border-line bg-ink px-6 py-5 text-center text-sm font-semibold leading-6 text-white/85">
        One student was paying for an empty room. Another couldn&apos;t find housing. RoomRelay
        matched them safely.
      </p>
    </div>
  );
}
