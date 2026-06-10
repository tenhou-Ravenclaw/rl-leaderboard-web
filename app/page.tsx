import { getAllResults, computeLeaderboard } from "@/lib/db";
import { LeaderboardTable } from "@/components/LeaderboardTable";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const kvReady = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
  const results = await getAllResults();
  const leaderboard = computeLeaderboard(results);
  const updatedAt =
    results.length > 0
      ? results.reduce((a, b) => (a.timestamp > b.timestamp ? a : b)).timestamp.slice(0, 10)
      : null;

  return (
    <div className="space-y-6">
      {!kvReady && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          <strong>Redis 未設定:</strong> Upstash Redis の環境変数が見つかりません。
          <code className="mx-1 font-mono">UPSTASH_REDIS_REST_URL</code> と
          <code className="mx-1 font-mono">UPSTASH_REDIS_REST_TOKEN</code> を設定してください。
        </div>
      )}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Current Rankings</h1>
          <p className="text-sm text-gray-500 mt-1">
            ユーザーごとの最高スコアで順位付け
          </p>
        </div>
        {updatedAt && (
          <p className="text-xs text-gray-400">最終更新: {updatedAt}</p>
        )}
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <LeaderboardTable rows={leaderboard} />
      </div>
    </div>
  );
}
