-- supabase-schema.sql
-- הרץ את הקובץ הזה ב-Supabase SQL Editor
-- אל תשנה שום טבלה קיימת

create table if not exists synthesized_intelligences (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),

  -- הצירוף שיצר אותה
  source_ids   text[] not null,        -- ['linguistic', 'logical', 'spatial']
  source_key   text not null unique,   -- 'linguistic+logical+spatial' (ממוין)

  -- תוכן האינטליגנציה החדשה
  name         text not null,
  type         text not null,
  essence      text not null,
  power        text not null,
  roles        text[] not null,
  quote        text not null,

  -- מטא-דאטה
  times_found  integer default 1,      -- כמה פעמים נוצר אותו צירוף
  source       text default 'synthesized'
);

-- אינדקס לחיפוש מהיר לפי מפתח הצירוף
create index if not exists idx_source_key
  on synthesized_intelligences (source_key);

-- Row Level Security — כולם יכולים לקרוא, כולם יכולים להוסיף
alter table synthesized_intelligences enable row level security;

create policy "כולם קוראים"
  on synthesized_intelligences for select
  using (true);

create policy "כולם מוסיפים"
  on synthesized_intelligences for insert
  with check (true);

-- עדכון מונה כאשר צירוף כבר קיים
create or replace function increment_times_found(key text)
returns void as $$
  update synthesized_intelligences
  set times_found = times_found + 1
  where source_key = key;
$$ language sql;
