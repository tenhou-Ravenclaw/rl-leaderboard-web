# RL Leaderboard Web — CLAUDE.md

## プロジェクト概要

GitHub Actions から評価結果を POST で受け取り、ランキングを Web 上で閲覧できる Next.js アプリ。
ストレージは Vercel KV (Redis)。評価は行わず、表示のみを担う。

評価側リポジトリ: `rl-leaderboard`（GitHub Actions で `POST /api/results` を叩く）

---

## アーキテクチャ

```
rl-leaderboard-web/
├── app/
│   ├── layout.tsx              # ヘッダー・フッター共通レイアウト
│   ├── page.tsx                # ランキングページ (Server Component)
│   ├── history/
│   │   └── page.tsx            # 実験履歴ページ (Server Component)
│   └── api/results/
│       └── route.ts            # POST /api/results — 評価結果受付
├── components/
│   ├── LeaderboardTable.tsx    # ランキング表
│   └── HistoryTable.tsx        # 履歴表
├── lib/
│   ├── db.ts                   # Vercel KV アクセス層
│   └── types.ts                # EvalResult 型定義
└── .env.local.example
```

---

## データフロー

```
GitHub Actions (rl-leaderboard)
  └─ POST /api/results
       Authorization: Bearer $SUBMIT_API_KEY
       Body: EvalResult JSON
         └─ kv.lpush("rl:results", ...)
              └─ /         → computeLeaderboard() → ランキング表示
              └─ /history  → 全履歴表示
```

---

## API: POST /api/results

### 認証

`Authorization: Bearer <SUBMIT_API_KEY>` ヘッダー必須。

### リクエストボディ (JSON)

```typescript
type EvalResult = {
  timestamp: string       // ISO 8601
  user: string
  model: string
  env: string             // "BipedalWalker-v3"
  episodes: number
  mean_reward: number
  max_reward: number
  min_reward: number
  std_reward: number
  completion_rate: number // 0.0 ~ 1.0
  mean_episode_length: number
  mean_distance: number
  mean_runtime_sec: number
}
```

### レスポンス

| Status | Body |
|--------|------|
| 201 | `{ "ok": true }` |
| 401 | `{ "error": "Unauthorized" }` |
| 422 | `{ "error": "Missing fields: ..." }` |

---

## 環境変数

| 変数 | 説明 |
|------|------|
| `KV_URL` | Vercel KV 接続文字列 |
| `KV_REST_API_URL` | KV REST エンドポイント |
| `KV_REST_API_TOKEN` | KV 書き込みトークン |
| `KV_REST_API_READ_ONLY_TOKEN` | KV 読み取りトークン |
| `SUBMIT_API_KEY` | GitHub Actions が使う POST 認証キー |

`.env.local.example` をコピーして `.env.local` を作成し、Vercel ダッシュボードから値を取得する。

---

## ローカル開発

```bash
cp .env.local.example .env.local
# .env.local に KV 接続情報と SUBMIT_API_KEY を記入
npm run dev
```

---

## Vercel デプロイ手順

1. Vercel にプロジェクトを作成
2. Storage > KV で新規 KV データベースを作成し、プロジェクトにリンク
3. Environment Variables に `SUBMIT_API_KEY` を追加
4. Push → 自動デプロイ

---

## rl-leaderboard との連携

`rl-leaderboard` の `.github/workflows/evaluate.yml` に以下を追加:

```yaml
- name: POST result to leaderboard
  run: |
    curl -X POST ${{ secrets.LEADERBOARD_API_URL }}/api/results \
      -H "Authorization: Bearer ${{ secrets.SUBMIT_API_KEY }}" \
      -H "Content-Type: application/json" \
      -d @results/latest.json
```

GitHub Secrets に `LEADERBOARD_API_URL`（デプロイ URL）と `SUBMIT_API_KEY` を設定する。

---

## 将来拡張

- **グラフ表示**: `recharts` でユーザーごとの報酬推移をプロット
- **複数環境対応**: `env` フィールドでフィルタリング
- **認証**: Vercel Auth で閲覧を制限
