-- =========================================================
-- CORE Egypt — MAKE ME ADMIN
--
-- Run this AFTER registering your teacher account on the site.
--
-- ⬇️  Replace ONLY the email inside the quotes on the line marked below.
--     Keep the single quotes.
-- =========================================================

do $$
declare
  me uuid;
  my_email text := 'YOUR-EMAIL@gmail.com';   -- ⬅️  CHANGE THIS ONE LINE ONLY
begin
  select id into me from auth.users where lower(email) = lower(trim(my_email));

  if me is null then
    raise exception 'No account found for "%". Register on the site first, then re-run this.', my_email;
  end if;

  -- become an admin (this also clears the "awaiting approval" state)
  update public.profiles set role = 'admin' where id = me;

  -- take ownership of the 6 seeded courses so they appear in "My Courses"
  update public.courses set instructor_id = me;

  raise notice 'Done — % is now an admin and owns all seeded courses.', my_email;
end $$;

-- Check: should show one row with role = admin
select first_name, role, code from public.profiles where role = 'admin';
