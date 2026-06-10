import { kv } from "@vercel/kv";
import type { EvalResult } from "./types";

const KEY = "rl:results";

export async function appendResult(result: EvalResult): Promise<void> {
  await kv.lpush(KEY, JSON.stringify(result));
}

export async function getAllResults(): Promise<EvalResult[]> {
  const raw = await kv.lrange<string>(KEY, 0, -1);
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
}

export function computeLeaderboard(results: EvalResult[]) {
  const best = new Map<string, EvalResult>();
  for (const r of results) {
    const key = `${r.user}::${r.model}`;
    const current = best.get(key);
    if (!current || r.mean_reward > current.mean_reward) {
      best.set(key, r);
    }
  }
  return [...best.values()]
    .sort((a, b) => b.mean_reward - a.mean_reward)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
