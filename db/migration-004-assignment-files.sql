-- =========================================================
-- CORE Egypt — Migration 004: Assignment brief files
-- Run in the Supabase SQL Editor. Safe to re-run.
--
-- Lets a teacher attach a PDF (or image) to an assignment. The file
-- lives in the existing private "course-materials" bucket, so the
-- storage rules already allow the course's enrolled students to open
-- it and only the instructor to upload it.
-- =========================================================

alter table public.assignments add column if not exists file_path text;
