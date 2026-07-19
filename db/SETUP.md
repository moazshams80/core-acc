# CORE Egypt — Database Setup (Supabase)

The portal runs in **demo mode** (mock data, any login works) until you complete
these steps. After them, registration creates **real accounts**, logins are **real**,
and the database enforces who can see what.

Total time: ~10 minutes. Everything is on Supabase's **free tier**.

---

## Step 1 — Create the Supabase project (you must do this part)

1. Go to <https://supabase.com> → **Start your project** → sign in with GitHub.
2. **New project** → name it `core-egypt`, choose a strong database password
   (save it somewhere — you rarely need it), region: **Frankfurt (eu-central-1)**
   is closest to Egypt.
3. Wait ~2 minutes for the project to provision.

## Step 2 — Create the schema and seed data

1. In the project, open **SQL Editor** (left sidebar).
2. Open [`schema.sql`](schema.sql) from this folder, paste the **whole file**, press **Run**.
   You should see "Success. No rows returned".
3. Do the same with [`seed.sql`](seed.sql) — this loads the 6 CORE programs,
   modules, lessons, assignments, and upcoming sessions.
4. Do the same with [`migration-002-teacher-approval.sql`](migration-002-teacher-approval.sql)
   — **important for security**: without it, anyone who visits your site can
   register as a teacher and immediately create courses and grade real
   students. After it, instructor signups wait for an admin's approval.

## Step 3 — Connect the frontend

1. In Supabase: **Project Settings → API**. Copy two values:
   - **Project URL** (like `https://abcdefgh.supabase.co`)
   - **anon / public key** (long string — it is *meant* to be public;
     all real protection is in the database policies)
2. Open [`../portal/db.js`](../portal/db.js) and paste them into
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top.
3. Commit + push (Vercel redeploys automatically).

That's it — the login and registration pages now use real accounts.

---

## Recommended Supabase settings

- **Authentication → Sign In / Up → Email**: for a smoother start, turn **OFF**
  "Confirm email" (users can log in immediately after registering). Turn it back
  on before a public launch.
- **Authentication → Passwords**: set minimum length to **8** to match the frontend.

## After creating your own teacher account

New signups from the Teacher login/register get the `teacher` role automatically.
To make yourself **admin** (unlocks downloads/exports) and claim the seeded courses,
run this in the SQL Editor (replace the email):

```sql
-- promote yourself to admin
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');

-- claim all seeded courses as their instructor
update public.courses set instructor_id =
  (select id from auth.users where email = 'YOUR-EMAIL@example.com');
```

## Instructor approvals (after migration 002)

- Someone registering as a **Teacher** gets the `pending_teacher` role. They can
  **not** log in, create courses, grade, or see student data.
- An **admin** sees an extra **🛡️ Approvals** item in the instructor sidebar
  (`teacher-approvals.html`), listing everyone waiting, with Approve / Reject.
  Approve → `teacher`. Reject → they keep a plain student account.
- Role changes go through the `approve_teacher()` function, which re-checks that
  the caller is an admin — so this can't be faked from the browser.
- Accounts created **before** the migration keep whatever role they had.

## Security notes (honest ones)

- The `admin` role can **never** be self-assigned — only via SQL/dashboard.
- Row Level Security is ON for every table; the anon key alone can read nothing
  except the public certificate-verification function.
- Email confirmation: if it's off, anyone can sign up with an address they don't
  own. Turn it on before a public launch.

## What's wired vs. what still uses mock data

| Area | Status after setup |
|---|---|
| Registration / Login / Logout | **Real** (Supabase Auth, role-checked) |
| Instructor approvals | **Real** (admin-gated, after migration 002) |
| All portal pages (dashboard, courses, grades, attendance…) | **Real** live data |
| Assignment submission, grading, sessions, attendance, profiles, enrollment | **Real** writes |
| Course builder — create **and edit** courses/modules/lessons/assignments | **Real** |
| Certificate QR verification page | Not built yet |
| File storage (course materials, assignment uploads) | Not built yet (Supabase Storage + admin-only download policies) |
