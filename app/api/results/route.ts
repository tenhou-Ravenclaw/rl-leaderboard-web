import { NextRequest } from "next/server";
import { appendResult } from "@/lib/db";
import type { EvalResult } from "@/lib/types";

const REQUIRED_KEYS: (keyof EvalResult)[] = [
  "timestamp",
  "user",
  "model",
  "env",
  "episodes",
  "mean_reward",
  "max_reward",
  "min_reward",
  "std_reward",
  "completion_rate",
  "mean_episode_length",
  "mean_distance",
  "mean_runtime_sec",
];

function isAuthorized(request: NextRequest): boolean {
  const apiKey = process.env.SUBMIT_API_KEY;
  if (!apiKey) return false;
  const auth = request.headers.get("Authorization") ?? "";
  return auth === `Bearer ${apiKey}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = body as Record<string, unknown>;
  const missing = REQUIRED_KEYS.filter((k) => result[k] === undefined);
  if (missing.length > 0) {
    return Response.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 422 }
    );
  }

  await appendResult(result as unknown as EvalResult);
  return Response.json({ ok: true }, { status: 201 });
}
