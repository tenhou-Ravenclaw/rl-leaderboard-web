import { getAllResults } from "@/lib/db";
import { HistoryTable } from "@/components/HistoryTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const results = await getAllResults();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Experiment History</h1>
        <p className="text-sm text-gray-500 mt-1">
          全提出の評価結果 ({results.length} 件)
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <HistoryTable results={results} />
      </div>
    </div>
  );
}
