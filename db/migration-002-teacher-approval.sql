-- =========================================================
-- CORE Egypt — Migration 002: Teacher approval flow
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Safe to re-run.
--
-- Before: anyone could self-register as a teacher and immediately
--         create courses and grade real students.
-- After:  teacher signups land in 'pending_teacher' (no teaching
--         powers) until an admin approves them.
-- Existing teacher/admin accounts are NOT affected.
-- =========================================================

-- 1) Allow the new role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'teacher', 'pending_teacher', 'admin'));

-- 2) Teacher signups now start as pending
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  fname text := coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), 'Student');
  wanted text := new.raw_user_meta_data->>'role';
  final_role text := case when wanted = 'teacher' then 'pending_teacher' else 'student' end;
begin
  insert into public.profiles (id, role, first_name, avatar_initials, code)
  values (
    new.id,
    final_role,
    fname,
    upper(left(fname, 1)),
    case when final_role = 'pending_teacher'
      then 'IN-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random()*1000)::text, 3, '0')
      else 'CA-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random()*10000)::text, 4, '0')
    end
  );
  return new;
end $$;

-- 3) Admin-only approval. A security-definer function is used instead of a
--    broad "admins can update any profile" policy so role changes can only
--    ever happen through this one audited path.
create or replace function public.approve_teacher(target uuid, approve boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'admin' then
    raise exception 'Only admins can review instructor requests';
  end if;
  if approve then
    update public.profiles set role = 'teacher'
      where id = target and role = 'pending_teacher';
  else
    update public.profiles set role = 'student'
      where id = target and role = 'pending_teacher';
  end if;
end $$;

revoke all on function public.approve_teacher(uuid, boolean) from public, anon;
grant execute on function public.approve_teacher(uuid, boolean) to authenticated;

-- 4) Pending teachers must not be able to create courses.
--    (my_role() returns 'pending_teacher', which fails these checks.)
--    Re-stated here so the intent is explicit:
--      courses insert  -> my_role() in ('teacher','admin')
--      is_teacher_of() -> owns the course, or admin
-- No change needed; the existing policies already exclude pending_teacher.
