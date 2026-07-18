-- =========================================================
-- CORE Egypt — Seed data (run AFTER schema.sql)
-- Seeds the 6 CORE programs with modules, lessons, assignments,
-- and upcoming live sessions. Courses start with no instructor;
-- claim them after creating your teacher account (see SETUP.md).
-- =========================================================

-- ---------- COURSES (fixed ids so this file is re-runnable) ----------
insert into public.courses (id, title, icon, description, tags, status) values
  ('00000000-0000-0000-0000-000000000001', 'Security Systems Engineering', '🛡️',
   'Design and integrate modern electronic security systems — from CCTV camera coverage and access control to intrusion detection — to professional engineering standards.',
   '{CCTV,"Access Control",Intrusion}', 'published'),
  ('00000000-0000-0000-0000-000000000002', 'Fire Alarm Systems Engineering', '🔥',
   'NFPA-aligned design of fire detection and suppression systems for real-world building safety.',
   '{NFPA,Detection,Suppression}', 'published'),
  ('00000000-0000-0000-0000-000000000003', 'Network Engineering', '🌐',
   'Routing, switching, TCP/IP protocols, and cybersecurity fundamentals for enterprise networks.',
   '{Routing,"TCP/IP",Cybersecurity}', 'published'),
  ('00000000-0000-0000-0000-000000000004', 'Audio Visual Systems', '🎚️',
   'Video walls, conferencing systems, and AV system integration for modern spaces.',
   '{"Video Walls","AV Integration",Conferencing}', 'published'),
  ('00000000-0000-0000-0000-000000000005', 'Building Management Systems', '🏢',
   'HVAC automation, smart building controls, and energy efficiency systems.',
   '{HVAC,Automation,"Smart Buildings"}', 'published'),
  ('00000000-0000-0000-0000-000000000006', 'Data Center Infrastructure', '🖥️',
   'Structured cabling, server room design, and enterprise network architecture.',
   '{Cabling,"Server Rooms",Network}', 'published')
on conflict (id) do nothing;

-- ---------- MODULES + LESSONS (course 1 fully built out as the model) ----------
insert into public.modules (id, course_id, title, position) values
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Module 1 — Security Fundamentals', 1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Module 2 — CCTV Design', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Module 3 — Access Control', 3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Module 4 — Intrusion Detection', 4),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'Module 5 — System Integration', 5),
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000002', 'Module 1 — Fire Science Basics', 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000002', 'Module 2 — Detection Systems', 2),
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000003', 'Module 1 — Networking Foundations', 1),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000003', 'Module 2 — Switching & Routing', 2)
on conflict (id) do nothing;

insert into public.lessons (module_id, title, type, duration, position) values
  ('00000000-0000-0000-0001-000000000001', 'Introduction to Electronic Security', 'video', '12 min', 1),
  ('00000000-0000-0000-0001-000000000001', 'Threats, Risk & Defense Layers', 'video', '18 min', 2),
  ('00000000-0000-0000-0001-000000000001', 'Reading: Industry Standards Overview', 'reading', '8 min', 3),
  ('00000000-0000-0000-0001-000000000002', 'Camera Types & Selection', 'video', '22 min', 1),
  ('00000000-0000-0000-0001-000000000002', 'Field of View & Coverage Planning', 'video', '26 min', 2),
  ('00000000-0000-0000-0001-000000000002', 'Lab: Draft a Coverage Plan', 'lab', '30 min', 3),
  ('00000000-0000-0000-0001-000000000003', 'Credentials, Readers & Controllers', 'video', '20 min', 1),
  ('00000000-0000-0000-0001-000000000003', 'Designing an Access Matrix', 'video', '24 min', 2),
  ('00000000-0000-0000-0001-000000000004', 'Sensor Technologies', 'video', '16 min', 1),
  ('00000000-0000-0000-0001-000000000005', 'Capstone: Full Building Security Design', 'lab', '45 min', 1),
  ('00000000-0000-0000-0002-000000000001', 'Combustion & Fire Behavior', 'video', '15 min', 1),
  ('00000000-0000-0000-0002-000000000002', 'Smoke, Heat & Flame Detectors', 'video', '21 min', 1),
  ('00000000-0000-0000-0003-000000000001', 'OSI & TCP/IP Models', 'video', '17 min', 1),
  ('00000000-0000-0000-0003-000000000001', 'Addressing & Subnetting', 'video', '28 min', 2),
  ('00000000-0000-0000-0003-000000000002', 'VLANs & Trunking', 'video', '22 min', 1);

-- ---------- ASSIGNMENTS ----------
insert into public.assignments (course_id, title, due_date, max_points) values
  ('00000000-0000-0000-0000-000000000001', 'CCTV Coverage Plan', current_date + 7, 100),
  ('00000000-0000-0000-0000-000000000001', 'Access Control Matrix', current_date + 14, 100),
  ('00000000-0000-0000-0000-000000000002', 'Fire Detection Layout (NFPA 72)', current_date + 10, 50),
  ('00000000-0000-0000-0000-000000000003', 'Subnetting Worksheet', current_date + 5, 40),
  ('00000000-0000-0000-0000-000000000003', 'VLAN Design Lab Report', current_date + 12, 100);

-- ---------- LIVE SESSIONS (upcoming, platform links to be set by teacher) ----------
insert into public.live_sessions (course_id, title, starts_at, duration_min, platform) values
  ('00000000-0000-0000-0000-000000000001', 'CCTV Network Integration', now() + interval '2 days', 60, 'meet'),
  ('00000000-0000-0000-0000-000000000002', 'Live Q&A: NFPA Standards', now() + interval '3 days', 60, 'zoom'),
  ('00000000-0000-0000-0000-000000000003', 'Routing Deep Dive', now() + interval '5 days', 90, 'teams');
