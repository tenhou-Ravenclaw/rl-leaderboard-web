import type { EvalResult } from "@/lib/types";

export function HistoryTable({ results }: { results: EvalResult[] }) {
  if (results.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">履歴がありません。</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Model</th>
            <th className="px-4 py-3 text-right">Mean Reward</th>
            <th className="px-4 py-3 text-right">Std</th>
            <th className="px-4 py-3 text-right">Completion</th>
            <th className="px-4 py-3 text-right">Ep. Length</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr
              key={i}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                {r.timestamp.slice(0, 10)}
              </td>
              <td className="px-4 py-3 font-medium">{r.user}</td>
              <td className="px-4 py-3 font-mono text-blue-600">{r.model}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {r.mean_reward.toFixed(1)}
              </td>
              <td className="px-4 py-3 text-right text-gray-500">
                ±{r.std_reward.toFixed(1)}
              </td>
              <td className="px-4 py-3 text-right">
                {(r.completion_rate * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-3 text-right text-gray-500">
                {r.mean_episode_length.toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
