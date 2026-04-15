-- ============================================================
-- 002_auth.sql
-- Link staff records to Supabase Auth users
-- ============================================================

alter table staff
  add column user_id uuid references auth.users(id) on delete set null;

create unique index staff_user_id_uidx on staff (user_id) where user_id is not null;
