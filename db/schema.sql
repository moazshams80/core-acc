-- =========================================================
-- CORE Egypt — Database schema (Supabase / Postgres)
-- Run this in the Supabase SQL Editor (whole file at once).
-- Includes tables, triggers, and Row Level Security policies.
--
-- A failed run rolls back completely — just fix and re-run.
-- If you ever need a full reset first, uncomment and run:
-- drop table if exists public.certificates, public.attendance,
--   public.live_sessions, public.submissions, public.assignments,
--   public.lesson_completions, public.enrollments, public.lessons,
--   public.modules, public.courses, public.profiles cascade;
-- drop function if exists public.handle_new_user(), public.my_role(),
--   public.is_teacher_of(uuid), public.verify_certificate(text) cascade;
-- =========================================================

-- ---------- PROFILES (extends Supabase auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  first_name text not null,
  code text unique,                       -- CA-2026-0317 (student) / IN-2026-014 (teacher)
  phone text,
  dob date,
  address text,
  avatar_initials text,
  bio text,
  disciplines text[],
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
-- Role comes from signup metadata but 'admin' can never be self-assigned;
-- promote admins manually: update profiles set role='admin' where id='...';
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  fname text := coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), 'Student');
  wanted text := new.raw_user_meta_data->>'role';
  final_role text := case when wanted = 'teacher' then 'teacher' else 'student' end;
begin
  insert into public.profiles (id, role, first_name, avatar_initials, code)
  values (
    new.id,
    final_role,
    fname,
    upper(left(fname, 1)),
    case when final_role = 'teacher'
      then 'IN-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random()*1000)::text, 3, '0')
      else 'CA-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random()*10000)::text, 4, '0')
    end
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- COURSES ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text default '📚',
  description text,
  tags text[] default '{}',
  instructor_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null default 0
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  type text not null default 'video' check (type in ('video','reading','lab','quiz')),
  duration text,
  position int not null default 0
);

-- ---------- ENROLLMENTS & PROGRESS ----------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.lesson_completions (
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

-- ---------- ASSIGNMENTS & SUBMISSIONS ----------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  due_date date,
  max_points int not null default 100
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  notes text,
  file_path text,                         -- storage path (bucket wired in a later phase)
  status text not null default 'submitted' check (status in ('submitted','graded')),
  score numeric,
  feedback text,
  unique (assignment_id, student_id)
);

-- ---------- LIVE SESSIONS & ATTENDANCE ----------
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  duration_min int not null default 60,
  platform text check (platform in ('zoom','meet','teams')),
  meeting_url text,
  recording_url text
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('present','absent','late')),
  unique (session_id, student_id)
);

-- ---------- CERTIFICATES ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  verification_code text not null unique,
  issued_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- Public certificate check (for the QR code) — callable WITHOUT login:
--   select * from verify_certificate('CORE-2026-NE318');
create or replace function public.verify_certificate(code text)
returns table (student_first_name text, course_title text, issued_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.first_name, c.title, ce.issued_at
  from public.certificates ce
  join public.profiles p on p.id = ce.student_id
  join public.courses c on c.id = ce.course_id
  where ce.verification_code = code
$$;
grant execute on function public.verify_certificate(text) to anon;

-- ---------- HELPERS (security definer avoids RLS recursion) ----------
-- Defined AFTER the tables: sql-language function bodies are validated
-- at creation time, so the tables they reference must already exist.
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_teacher_of(cid uuid)
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.courses c where c.id = cid and c.instructor_id = auth.uid())
       or public.my_role() = 'admin' $$;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles           enable row level security;
alter table public.courses            enable row level security;
alter table public.modules            enable row level security;
alter table public.lessons            enable row level security;
alter table public.enrollments        enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.assignments        enable row level security;
alter table public.submissions        enable row level security;
alter table public.live_sessions      enable row level security;
alter table public.attendance         enable row level security;
alter table public.certificates       enable row level security;

-- PROFILES: any signed-in user can read (names are first-name only);
-- users edit their own row; role changes only via admin/SQL.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles
  for select to authenticated using (true);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- COURSES: published visible to all signed-in users; teachers manage their own.
drop policy if exists "courses read" on public.courses;
create policy "courses read" on public.courses
  for select to authenticated using (status = 'published' or instructor_id = auth.uid() or public.my_role() = 'admin');
drop policy if exists "courses insert" on public.courses;
create policy "courses insert" on public.courses
  for insert to authenticated with check (public.my_role() in ('teacher','admin') and instructor_id = auth.uid());
drop policy if exists "courses update" on public.courses;
create policy "courses update" on public.courses
  for update to authenticated using (instructor_id = auth.uid() or public.my_role() = 'admin');
drop policy if exists "courses delete" on public.courses;
create policy "courses delete" on public.courses
  for delete to authenticated using (instructor_id = auth.uid() or public.my_role() = 'admin');

-- MODULES / LESSONS: readable with the course; managed by the course teacher.
drop policy if exists "modules read" on public.modules;
create policy "modules read" on public.modules
  for select to authenticated using (exists (select 1 from public.courses c where c.id = course_id
    and (c.status = 'published' or c.instructor_id = auth.uid() or public.my_role() = 'admin')));
drop policy if exists "modules write" on public.modules;
create policy "modules write" on public.modules
  for all to authenticated using (public.is_teacher_of(course_id)) with check (public.is_teacher_of(course_id));
drop policy if exists "lessons read" on public.lessons;
create policy "lessons read" on public.lessons
  for select to authenticated using (exists (select 1 from public.modules m join public.courses c on c.id = m.course_id
    where m.id = module_id and (c.status = 'published' or c.instructor_id = auth.uid() or public.my_role() = 'admin')));
drop policy if exists "lessons write" on public.lessons;
create policy "lessons write" on public.lessons
  for all to authenticated
  using (exists (select 1 from public.modules m where m.id = module_id and public.is_teacher_of(m.course_id)))
  with check (exists (select 1 from public.modules m where m.id = module_id and public.is_teacher_of(m.course_id)));

-- ENROLLMENTS: students see their own and can self-enroll in published courses;
-- the course teacher sees/manages their roster.
drop policy if exists "enrollments read" on public.enrollments;
create policy "enrollments read" on public.enrollments
  for select to authenticated using (student_id = auth.uid() or public.is_teacher_of(course_id));
drop policy if exists "enrollments self insert" on public.enrollments;
create policy "enrollments self insert" on public.enrollments
  for insert to authenticated with check (
    (student_id = auth.uid() and exists (select 1 from public.courses c where c.id = course_id and c.status = 'published'))
    or public.is_teacher_of(course_id));
drop policy if exists "enrollments teacher delete" on public.enrollments;
create policy "enrollments teacher delete" on public.enrollments
  for delete to authenticated using (public.is_teacher_of(course_id) or student_id = auth.uid());

-- LESSON COMPLETIONS: students manage their own checkmarks.
drop policy if exists "completions own" on public.lesson_completions;
create policy "completions own" on public.lesson_completions
  for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ASSIGNMENTS: visible to enrolled students + the teacher; managed by the teacher.
drop policy if exists "assignments read" on public.assignments;
create policy "assignments read" on public.assignments
  for select to authenticated using (
    public.is_teacher_of(course_id)
    or exists (select 1 from public.enrollments e where e.course_id = assignments.course_id and e.student_id = auth.uid()));
drop policy if exists "assignments write" on public.assignments;
create policy "assignments write" on public.assignments
  for all to authenticated using (public.is_teacher_of(course_id)) with check (public.is_teacher_of(course_id));

-- SUBMISSIONS: students create/see their own; the course teacher sees and grades.
drop policy if exists "submissions student read" on public.submissions;
create policy "submissions student read" on public.submissions
  for select to authenticated using (
    student_id = auth.uid()
    or exists (select 1 from public.assignments a where a.id = assignment_id and public.is_teacher_of(a.course_id)));
drop policy if exists "submissions student insert" on public.submissions;
create policy "submissions student insert" on public.submissions
  for insert to authenticated with check (student_id = auth.uid());
drop policy if exists "submissions grade" on public.submissions;
create policy "submissions grade" on public.submissions
  for update to authenticated using (
    exists (select 1 from public.assignments a where a.id = assignment_id and public.is_teacher_of(a.course_id)));

-- LIVE SESSIONS: visible to enrolled students + teacher; managed by teacher.
drop policy if exists "sessions read" on public.live_sessions;
create policy "sessions read" on public.live_sessions
  for select to authenticated using (
    public.is_teacher_of(course_id)
    or exists (select 1 from public.enrollments e where e.course_id = live_sessions.course_id and e.student_id = auth.uid()));
drop policy if exists "sessions write" on public.live_sessions;
create policy "sessions write" on public.live_sessions
  for all to authenticated using (public.is_teacher_of(course_id)) with check (public.is_teacher_of(course_id));

-- ATTENDANCE: students see their own records; the teacher marks/manages.
drop policy if exists "attendance read" on public.attendance;
create policy "attendance read" on public.attendance
  for select to authenticated using (
    student_id = auth.uid()
    or exists (select 1 from public.live_sessions s where s.id = session_id and public.is_teacher_of(s.course_id)));
drop policy if exists "attendance write" on public.attendance;
create policy "attendance write" on public.attendance
  for all to authenticated
  using (exists (select 1 from public.live_sessions s where s.id = session_id and public.is_teacher_of(s.course_id)))
  with check (exists (select 1 from public.live_sessions s where s.id = session_id and public.is_teacher_of(s.course_id)));

-- CERTIFICATES: students see their own; issued by the course teacher/admin.
drop policy if exists "certificates read" on public.certificates;
create policy "certificates read" on public.certificates
  for select to authenticated using (student_id = auth.uid() or public.is_teacher_of(course_id));
drop policy if exists "certificates issue" on public.certificates;
create policy "certificates issue" on public.certificates
  for insert to authenticated with check (public.is_teacher_of(course_id));
