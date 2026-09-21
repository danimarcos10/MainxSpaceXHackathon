export interface ContractCheckResponse {
  status: "safe" | "permission_required" | "problem" | "unclear";
  title: string;
  summary: string;
  evidence: Array<{
    quote: string;
    explanation: string;
  }>;
  flags: string[];
  nextSteps: string[];
  confidence: "high" | "medium" | "low";
}

export interface LandlordRequestResponse {
  subject: string;
  message: string;
}

const mockDelay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function checkContract(
  file: File,
): Promise<ContractCheckResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ai/contract-check", {
    method: "POST",
    body: formData,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      "The contract analysis service returned an unreadable response. Please retry.",
    );
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "The rental agreement could not be analyzed. Please retry.";

    throw new Error(message);
  }

  return payload as ContractCheckResponse;
}

export async function generateLandlordRequest(): Promise<LandlordRequestResponse> {
  await mockDelay(500);

  return {
    subject: "Request for temporary subletting permission",
    message:
      "Dear landlord, I will be temporarily away from Maastricht from October 1, 2026 until January 31, 2027 and would like to request written permission to sublet my room to another verified Maastricht University student during this period...",
  };
}
