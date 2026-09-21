import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { ContractCheckResponse } from "@/lib/ai";

export const runtime = "nodejs";

const MAX_PDF_SIZE = 20 * 1024 * 1024;
const MODEL = "gemini-3.5-flash-lite";

const responseJsonSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["safe", "permission_required", "problem", "unclear"],
    },
    title: { type: "string" },
    summary: { type: "string" },
    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["quote", "explanation"],
      },
    },
    flags: {
      type: "array",
      items: { type: "string" },
    },
    nextSteps: {
      type: "array",
      items: { type: "string" },
    },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low"],
    },
  },
  required: [
    "status",
    "title",
    "summary",
    "evidence",
    "flags",
    "nextSteps",
    "confidence",
  ],
};

const analysisPrompt = `
Analyze the attached residential rental agreement for a university student who
wants to temporarily sublet their room while away.

Your task is contract analysis only. Determine what this uploaded contract
itself says about:
- subletting;
- temporary occupants;
- landlord or owner permission;
- assignment or transfer of the tenancy; and
- any relevant restrictions.

Follow these rules strictly:
1. Base every conclusion only on the uploaded document.
2. Never invent or paraphrase a clause as if it were present.
3. If the document does not clearly answer something, mark it as unclear.
4. Do not state that an arrangement is legal under Dutch law merely because the
   contract appears to permit it.
5. Distinguish between: allowed by contract, landlord permission required,
   apparently prohibited or materially restricted by contract, and unclear.
6. Include short, exact excerpts from the document that support the conclusion.
   If no relevant excerpt exists, return an empty evidence array.
7. Give practical next steps.
8. Make the summary clear that this is contract analysis, not legal advice.

Status definitions:
- safe: the contract appears to allow the relevant temporary subletting
  arrangement without an obvious permission requirement.
- permission_required: the contract appears to require landlord or owner consent.
- problem: the contract appears to prohibit or materially restrict the proposed
  subletting.
- unclear: the document does not contain enough clear information.

Return only the requested structured response.
`;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The upload could not be read. Please choose the PDF again." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Please upload a rental agreement PDF." },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF rental agreements are supported." },
      { status: 415 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "The uploaded PDF is empty." },
      { status: 400 },
    );
  }

  if (file.size > MAX_PDF_SIZE) {
    return NextResponse.json(
      { error: "The PDF must be 20 MB or smaller." },
      { status: 413 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contract analysis is not configured on this server." },
      { status: 503 },
    );
  }

  try {
    const pdfBytes = Buffer.from(await file.arrayBuffer());
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBytes.toString("base64"),
              },
            },
            { text: analysisPrompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema,
        temperature: 0.1,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsedResponse: unknown = JSON.parse(response.text);
    if (!isContractCheckResponse(parsedResponse)) {
      throw new Error("Gemini returned a response with an unexpected structure.");
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Gemini contract analysis failed:", error);

    const status = getErrorStatus(error);
    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "Contract analysis is temporarily rate-limited. Please wait a moment and retry.",
        },
        { status: 429 },
      );
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        {
          error:
            "Contract analysis could not authenticate with the AI service. Check the server configuration.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        error:
          "The rental agreement could not be analyzed. Please retry with a clear PDF.",
      },
      { status: 502 },
    );
  }
}

function isContractCheckResponse(
  value: unknown,
): value is ContractCheckResponse {
  if (!value || typeof value !== "object") return false;

  const result = value as Partial<ContractCheckResponse>;
  const statuses = ["safe", "permission_required", "problem", "unclear"];
  const confidenceLevels = ["high", "medium", "low"];

  return (
    typeof result.status === "string" &&
    statuses.includes(result.status) &&
    typeof result.title === "string" &&
    typeof result.summary === "string" &&
    Array.isArray(result.evidence) &&
    result.evidence.every(
      (item) =>
        item &&
        typeof item.quote === "string" &&
        typeof item.explanation === "string",
    ) &&
    isStringArray(result.flags) &&
    isStringArray(result.nextSteps) &&
    typeof result.confidence === "string" &&
    confidenceLevels.includes(result.confidence)
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function getErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;

  const candidate = error as { status?: unknown; code?: unknown };
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.code === "number") return candidate.code;
  return undefined;
}
