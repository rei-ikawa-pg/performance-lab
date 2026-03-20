---
name: コーディング規約のカスタマイズ
description: コメントは日本語、ファイル名はPascalCase維持。frontend-coding-standardsの§9ファイル名kebab-caseルールは適用しない。
type: feedback
---

コード内のコメント（TODO含む）は日本語で書くこと。

**Why:** プロジェクトのドキュメント・仕様書がすべて日本語であり、英語コメントだと不統一になる。
**How to apply:** このリポジトリでコメントを書く際は常に日本語を使う。

---

コンポーネントファイル名はPascalCase（例: `MeasureForm.tsx`）を維持する。kebab-caseにリネームしない。

**Why:** ユーザーの好み。
**How to apply:** 新規ファイル作成時もPascalCaseで統一する。
