-- =========================================================
-- CORE Egypt — Migration 003: File storage
-- Run this in the Supabase SQL Editor. Safe to re-run.
--
-- Adds three private storage buckets and the rules for who may
-- read/write each file, plus a materials table and a file column
-- on certificates.
--
-- PATH CONVENTION (the security rules depend on it):
--   course-materials/{course_id}/{filename}
--   submissions/{course_id}/{student_id}/{filename}
--   certificates/{course_id}/{student_id}/{filename}
-- The first folder is always the course, the second (where present)
-- is always the student — that is how the policies below decide access.
-- =========================================================


-- ---------- BUCKETS (all private; files are served via signed URLs) ----------
insert into storage.buckets (id, name, public) values
  ('course-materials', 'course-materials', false),
  ('submissions',      'submissions',      false),
  ('certificates',     'certificates',     false)
on conflict (id) do nothing;


-- ---------- MATERIALS TABLE ----------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  file_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_at timestamptz not null default now()
);

alter table public.materials enable row level security;

-- enrolled students and the course teacher can see a course's materials
drop policy if exists "materials read" on public.materials;
create policy "materials read" on public.materials
  for select to authenticated using (
    public.is_teacher_of(course_id)
    or exists (select 1 from public.enrollments e
               where e.course_id = materials.course_id and e.student_id = auth.uid())
  );

-- only the course teacher (or an admin) can add/remove materials
drop policy if exists "materials write" on public.materials;
create policy "materials write" on public.materials
  for all to authenticated
  using (public.is_teacher_of(course_id))
  with check (public.is_teacher_of(course_id));


-- ---------- CERTIFICATES: store the uploaded file ----------
alter table public.certificates add column if not exists file_path text;

-- teachers may also revoke a certificate they issued
drop policy if exists "certificates revoke" on public.certificates;
create policy "certificates revoke" on public.certificates
  for delete to authenticated using (public.is_teacher_of(course_id));


-- =========================================================
-- STORAGE ACCESS RULES
-- storage.objects.name is the full path, e.g. "<course_id>/file.pdf".
-- storage.foldername(name) splits it, so [1] = course_id, [2] = student_id.
-- =========================================================

-- ---------- course-materials ----------
drop policy if exists "materials files read" on storage.objects;
create policy "materials files read" on storage.objects
  for select to authenticated using (
    bucket_id = 'course-materials'
    and (
      public.is_teacher_of(((storage.foldername(name))[1])::uuid)
      or exists (select 1 from public.enrollments e
                 where e.course_id = ((storage.foldername(name))[1])::uuid
                   and e.student_id = auth.uid())
    )
  );

drop policy if exists "materials files write" on storage.objects;
create policy "materials files write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'course-materials'
    and public.is_teacher_of(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "materials files delete" on storage.objects;
create policy "materials files delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'course-materials'
    and public.is_teacher_of(((storage.foldername(name))[1])::uuid)
  );


-- ---------- submissions ----------
-- a student may upload into their own folder, for a course they are enrolled in
drop policy if exists "submission files write" on storage.objects;
create policy "submission files write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'submissions'
    and ((storage.foldername(name))[2])::uuid = auth.uid()
    and exists (select 1 from public.enrollments e
                where e.course_id = ((storage.foldername(name))[1])::uuid
                  and e.student_id = auth.uid())
  );

-- the student sees their own work; the course teacher sees all of it
drop policy if exists "submission files read" on storage.objects;
create policy "submission files read" on storage.objects
  for select to authenticated using (
    bucket_id = 'submissions'
    and (
      ((storage.foldername(name))[2])::uuid = auth.uid()
      or public.is_teacher_of(((storage.foldername(name))[1])::uuid)
    )
  );

-- a student may replace their own file before it is graded
drop policy if exists "submission files update" on storage.objects;
create policy "submission files update" on storage.objects
  for update to authenticated using (
    bucket_id = 'submissions'
    and ((storage.foldername(name))[2])::uuid = auth.uid()
  );


-- ---------- certificates ----------
-- issued by the course teacher
drop policy if exists "certificate files write" on storage.objects;
create policy "certificate files write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'certificates'
    and public.is_teacher_of(((storage.foldername(name))[1])::uuid)
  );

-- the graduate can always view their own certificate
drop policy if exists "certificate files read" on storage.objects;
create policy "certificate files read" on storage.objects
  for select to authenticated using (
    bucket_id = 'certificates'
    and (
      ((storage.foldername(name))[2])::uuid = auth.uid()
      or public.is_teacher_of(((storage.foldername(name))[1])::uuid)
    )
  );

drop policy if exists "certificate files delete" on storage.objects;
create policy "certificate files delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'certificates'
    and public.is_teacher_of(((storage.foldername(name))[1])::uuid)
  );


-- =========================================================
-- DONE — expect "Success. No rows returned".
-- =========================================================
