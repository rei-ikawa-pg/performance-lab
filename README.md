# Performance Lab

任意のURLを入力すると、PageSpeed Insights API経由でCore Web Vitals（LCP, CLS, INP, FCP, TTFB）を計測し、スコアの可視化と改善提案レポートを提供するWebアプリケーションです。

## 技術スタック

| カテゴリ       | 技術                                        |
| -------------- | ------------------------------------------- |
| フレームワーク | Next.js 15 (App Router) + TypeScript 5.x    |
| スタイリング   | Tailwind CSS + shadcn/ui                    |
| チャート       | D3.js（SVGゲージチャート）                  |
| データフェッチ | TanStack Query                              |
| 認証           | NextAuth.js v5（Google OAuth）              |
| データベース   | Supabase（PostgreSQL）                      |
| テスト         | Vitest + React Testing Library + Playwright |
| デプロイ       | Vercel                                      |

## 主な機能

- Google OAuth によるログイン
- URL入力 → Core Web Vitals 計測（モバイル / デスクトップ）
- D3.js によるアニメーション付きゲージチャート
- Google公式基準に基づくスコア判定（Good / Needs Improvement / Poor）
- 改善提案レポートの展開/折りたたみ表示
- 計測履歴のダッシュボード（Supabase連携）
- Rate Limiting（1ユーザー10リクエスト/時）

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、各値を設定してください。

```bash
cp .env.local.example .env.local
```

| 変数名                          | 説明                                             |
| ------------------------------- | ------------------------------------------------ |
| `AUTH_SECRET`                   | NextAuth.js のシークレットキー                   |
| `AUTH_GOOGLE_ID`                | Google OAuth クライアントID                      |
| `AUTH_GOOGLE_SECRET`            | Google OAuth クライアントシークレット            |
| `PAGESPEED_API_KEY`             | PageSpeed Insights API キー                      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase プロジェクトURL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase サービスロールキー                      |
| `NEXTAUTH_URL`                  | アプリのURL（ローカル: `http://localhost:3000`） |

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

## スクリプト一覧

| コマンド               | 説明                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | 開発サーバー起動                 |
| `npm run build`        | プロダクションビルド             |
| `npm run start`        | プロダクションサーバー起動       |
| `npm run lint`         | ESLint 実行                      |
| `npm run format`       | Prettier でフォーマット          |
| `npm run format:check` | フォーマットチェック             |
| `npm run test`         | ユニットテスト実行               |
| `npm run test:watch`   | ユニットテスト（ウォッチモード） |
| `npm run test:e2e`     | E2Eテスト実行                    |
| `npm run type-check`   | TypeScript 型チェック            |

## ディレクトリ構成

```
src/
├── app/                    # ルーティング + ページ
│   ├── api/                # Route Handlers
│   │   ├── auth/           # NextAuth.js
│   │   ├── measure/        # 計測API
│   │   └── measurements/   # 履歴API
│   ├── dashboard/          # ダッシュボード
│   └── report/[id]/        # 計測結果詳細
├── components/             # UIコンポーネント
│   ├── ui/                 # shadcn/ui
│   └── charts/             # D3.js チャート
├── lib/                    # ユーティリティ・設定
│   ├── auth.ts             # NextAuth.js 設定
│   ├── pagespeed.ts        # PageSpeed API クライアント
│   ├── supabase.ts         # Supabase クライアント
│   ├── rate-limit.ts       # レート制限
│   └── utils.ts            # スコア判定・フォーマット
└── types/                  # 型定義
```

## スコア判定基準

Google公式基準に準拠しています。

| メトリクス | Good     | Needs Improvement | Poor     |
| ---------- | -------- | ----------------- | -------- |
| LCP        | ≤ 2500ms | ≤ 4000ms          | > 4000ms |
| CLS        | ≤ 0.1    | ≤ 0.25            | > 0.25   |
| INP        | ≤ 200ms  | ≤ 500ms           | > 500ms  |
| FCP        | ≤ 1800ms | ≤ 3000ms          | > 3000ms |
| TTFB       | ≤ 800ms  | ≤ 1800ms          | > 1800ms |
