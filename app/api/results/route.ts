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

  let text: string;
  try {
    text = await request.text();
  } catch (e) {
    console.error("[api/results] Failed to read body:", e);
    return Response.json({ error: "Failed to read request body" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch (e) {
    console.error("[api/results] Failed to parse JSON:", e, "body:", text.slice(0, 200));
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

  try {
    await appendResult(result as unknown as EvalResult);
  } catch (e) {
    console.error("[api/results] Failed to store result:", e);
    return Response.json({ error: "Failed to store result" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
