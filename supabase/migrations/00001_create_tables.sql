-- measurements テーブル
create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  url text not null,
  strategy text not null check (strategy in ('mobile', 'desktop')),
  performance_score integer not null,
  lcp double precision not null,
  cls double precision not null,
  inp double precision not null,
  fcp double precision not null,
  ttfb double precision not null,
  audits jsonb not null default '[]'::jsonb,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- urls テーブル（ダッシュボード用）
create table if not exists urls (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  url text not null,
  label text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, url)
);

-- インデックス
create index if not exists idx_measurements_user_id on measurements (user_id);
create index if not exists idx_measurements_created_at on measurements (created_at desc);
create index if not exists idx_urls_user_id on urls (user_id);

-- RLS 有効化
alter table measurements enable row level security;
alter table urls enable row level security;

-- RLS ポリシー: ユーザーは自分のデータのみアクセス可
create policy "Users can view own measurements"
  on measurements for select
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own measurements"
  on measurements for insert
  with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can view own urls"
  on urls for select
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own urls"
  on urls for insert
  with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can delete own urls"
  on urls for delete
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
