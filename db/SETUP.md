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

## Security notes (honest ones)

- Anyone can currently self-register as a **teacher** from the site. That's fine
  while testing; before launch, either remove the teacher option from the public
  register page or add an approval step (`role` stays `student` until an admin
  promotes it).
- The `admin` role can **never** be self-assigned — only via SQL/dashboard.
- Row Level Security is ON for every table; the anon key alone can read nothing
  except the public certificate-verification function.

## What's wired vs. what still uses mock data

| Area | Status after setup |
|---|---|
| Registration / Login / Logout | **Real** (Supabase Auth, role-checked) |
| Portal pages (dashboard, courses, grades…) | Still mock data — wiring them to the database is the next phase |
| File storage (course materials) | Later phase (Supabase Storage + admin-only download policies) |
