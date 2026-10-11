-- StudyFlow: align public.tasks with the React task form
-- Additive only: does not DROP columns, DELETE rows, or change RLS policies.
-- Confirmed missing from live errors: course_code, due_time
-- Other columns are added with IF NOT EXISTS so existing columns are left untouched.

begin;

alter table public.tasks
  add column if not exists user_id uuid,
  add column if not exists title text,
  add column if not exists description text default '',
  add column if not exists category text default 'General Study',
  add column if not exists priority text default 'medium',
  add column if not exists status text default 'pending',
  add column if not exists due_date date,
  add column if not exists due_time text,
  add column if not exists estimated_minutes integer,
  add column if not exists course_code text default '',
  add column if not exists tags text[] default array[]::text[],
  add column if not exists subtasks jsonb default '[]'::jsonb,
  add column if not exists created_at timestamptz default timezone('utc'::text, now()),
  add column if not exists updated_at timestamptz default timezone('utc'::text, now());

-- Optional value constraints. These allow NULL so existing rows stay valid.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_priority_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_priority_check
      check (priority is null or priority in ('low', 'medium', 'high', 'urgent'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_status_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_status_check
      check (status is null or status in ('pending', 'in_progress', 'completed'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_estimated_minutes_check'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_estimated_minutes_check
      check (estimated_minutes is null or estimated_minutes >= 0);
  end if;
end
$$;

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_status_idx on public.tasks (status);

-- Keep RLS enabled. Do not drop or replace existing policies.
alter table public.tasks enable row level security;

-- Reload PostgREST schema cache so new columns are visible to the API.
notify pgrst, 'reload schema';

commit;
