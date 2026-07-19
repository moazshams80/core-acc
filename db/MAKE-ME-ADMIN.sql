-- =========================================================
-- CORE Egypt — MAKE ME ADMIN
--
-- Run this AFTER you have registered your teacher account on the site.
--
-- ⬇️  REPLACE the email on the next line with the one you registered with.
-- =========================================================

-- 1) Make yourself an admin (also lifts the "awaiting approval" state,
--    so you can log in immediately and approve other instructors).
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'YOUR-EMAIL@gmail.com');

-- 2) Make yourself the instructor of all 6 seeded courses,
--    so they show up under "My Courses" in the teacher portal.
update public.courses set instructor_id =
  (select id from auth.users where email = 'YOUR-EMAIL@gmail.com');

-- 3) Check it worked — should show your name with role = admin.
select first_name, role, code from public.profiles
where id = (select id from auth.users where email = 'YOUR-EMAIL@gmail.com');
