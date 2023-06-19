import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export interface AiDetectInput {
  text: string;
}

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

const key = process.env.SAPLING_API_KEY!;

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, text, sent_scores: false }),
  });
  const body = res.ok
    ? await res.json()
    : { error: await res.json() };
  return NextResponse.json(body, { status: res.status });
}
