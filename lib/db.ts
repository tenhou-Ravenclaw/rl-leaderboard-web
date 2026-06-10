import { Redis } from "@upstash/redis";
import type { EvalResult } from "./types";

const KEY = "rl:results";

function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function appendResult(result: EvalResult): Promise<void> {
  const redis = getRedis();
  await redis.lpush(KEY, JSON.stringify(result));
}

export async function getAllResults(): Promise<EvalResult[]> {
  if (!isRedisConfigured()) return [];
  try {
    const redis = getRedis();
    const raw = await redis.lrange<string>(KEY, 0, -1);
    return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  } catch {
    return [];
  }
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
