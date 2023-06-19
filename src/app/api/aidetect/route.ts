import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export interface AiDetectInput {
  input: string;
}

// Sapling
export interface AiDetectOutput {
  error?: {
    key_prefix: string
    msg: string
  };
  score?: number; // 0.0=human, 1.0=ai
  sentence_scores?: {
    sentence: string;
    score: number; // 0.0=human, 1.0=ai
  };
}

// Writer
// export interface AiDetectOutput {
//   errors?: {
//     description: string;
//     key: string;
//     extras: string;
//   }[];
//   scores?: {
//     score: number;
//     label: "real" | "fake";
//   }[];
// }

const SaplingApiKey = process.env.SAPLING_API_KEY!;
const SaplingAiDetectRoute = "https://api.sapling.ai/api/v1/aidetect";

const WriterApiKey = process.env.WRITER_API_KEY!;
const WriterOrgId = 557499;
const WriterAiDetectRoute = `https://enterprise-api.writer.com/content/organization/${WriterOrgId}/detect`;

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  const res = await fetch(SaplingAiDetectRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // accept: "application/json",
      // Authorization: `Bearer ${WriterApiKey}`,
    },
    body: JSON.stringify({
      key: SaplingApiKey,
      text: input,
      sent_scores: false
    }),
  });
  // const body = res.ok ? { scores: await res.json() } : await res.json();
  const body: AiDetectOutput = !res.ok ? { error: await res.json() } : await res.json();
  return NextResponse.json(body, { status: res.status });
}
