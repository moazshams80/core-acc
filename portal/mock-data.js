/* =========================================================
   CORE Egypt — Student Portal MOCK DATA
   Single source of truth for all portal pages.
   Frontend-only prototype — no backend.
   ========================================================= */

/* Deterministic "today" for the prototype */
var TODAY = new Date(2026, 5, 16); // 2026-06-16

var currentStudent = {
  name: "Youssef",
  id: "CA-2024-0317",
  email: "youssef@student.coreegypt.com",
  phone: "+20 100 555 0317",
  dob: "1999-03-12",
  address: "12 Nasr Road, Nasr City, Cairo, Egypt",
  program: "Security Systems Engineering",
  avatarInitials: "Y",
  joinDate: "Sept 2024",
  dayOfJourney: 142,
};

/* The 6 CORE Egypt engineering programs, used as enrolled courses */
var courses = [
  {
    id: "c1",
    title: "Security Systems Engineering",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    instructor: "Eng. Karim",
    progress: 75,
    status: "in-progress",
    enrolledOn: "Oct 2024",
    description:
      "Design and integrate modern electronic security systems — from CCTV camera coverage and access control to intrusion detection — to professional engineering standards.",
    outcomes: [
      "Design CCTV coverage plans and select appropriate cameras",
      "Configure access control systems and credential hierarchies",
      "Integrate intrusion detection with central monitoring",
      "Produce as-built documentation employers can trust",
    ],
    tags: ["CCTV", "Access Control", "Intrusion"],
    modules: [
      {
        title: "Module 1 — Security Fundamentals",
        lessons: [
          { title: "Introduction to Electronic Security", type: "video", length: "12 min", done: true },
          { title: "Threats, Risk & Defense Layers", type: "video", length: "18 min", done: true },
          { title: "Reading: Industry Standards Overview", type: "reading", length: "8 min", done: true },
        ],
      },
      {
        title: "Module 2 — CCTV Design",
        lessons: [
          { title: "Camera Types & Selection", type: "video", length: "22 min", done: true },
          { title: "Field of View & Coverage Planning", type: "video", length: "26 min", done: true },
          { title: "Lab: Draft a Coverage Plan", type: "reading", length: "30 min", done: false },
        ],
      },
      {
        title: "Module 3 — Access Control",
        lessons: [
          { title: "Credentials, Readers & Controllers", type: "video", length: "20 min", done: true },
          { title: "Designing an Access Matrix", type: "video", length: "24 min", done: false },
          { title: "Reading: Anti-Passback & Interlocks", type: "reading", length: "10 min", done: false },
        ],
      },
      {
        title: "Module 4 — Intrusion Detection",
        lessons: [
          { title: "Sensor Technologies", type: "video", length: "16 min", done: false },
          { title: "Zoning & Panel Configuration", type: "video", length: "19 min", done: false },
        ],
      },
      {
        title: "Module 5 — System Integration",
        lessons: [
          { title: "Integrating CCTV + Access + Alarm", type: "video", length: "28 min", done: false },
          { title: "Capstone: Full Building Security Design", type: "reading", length: "45 min", done: false },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "Fire Alarm Systems Engineering",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C10 8 12 6 12 2z"/><path d="M9 14a3 3 0 0 0 6 0c0-2-2-3-3-5-1 2-3 3-3 5z"/></svg>',
    instructor: "Eng. Mona",
    progress: 40,
    status: "in-progress",
    enrolledOn: "Nov 2024",
    description:
      "NFPA-aligned design of fire detection and suppression systems for real-world building safety.",
    outcomes: [
      "Apply NFPA 72 to detection system layout",
      "Select detectors and notification appliances",
      "Design basic suppression strategies",
    ],
    tags: ["NFPA", "Detection", "Suppression"],
    modules: [
      { title: "Module 1 — Fire Science Basics", lessons: [
        { title: "Combustion & Fire Behavior", type: "video", length: "15 min", done: true },
        { title: "Reading: NFPA Code Family", type: "reading", length: "12 min", done: true },
      ]},
      { title: "Module 2 — Detection Systems", lessons: [
        { title: "Smoke, Heat & Flame Detectors", type: "video", length: "21 min", done: true },
        { title: "Detector Spacing per NFPA 72", type: "video", length: "24 min", done: false },
      ]},
      { title: "Module 3 — Notification & Control", lessons: [
        { title: "Notification Appliances", type: "video", length: "18 min", done: false },
        { title: "Control Panels & Circuits", type: "video", length: "20 min", done: false },
      ]},
      { title: "Module 4 — Suppression", lessons: [
        { title: "Sprinkler & Gas Systems", type: "video", length: "26 min", done: false },
      ]},
      { title: "Module 5 — Documentation", lessons: [
        { title: "Shop Drawings & Submittals", type: "reading", length: "30 min", done: false },
      ]},
    ],
  },
  {
    id: "c3",
    title: "Network Engineering",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    instructor: "Eng. Tarek",
    progress: 100,
    status: "completed",
    enrolledOn: "Sept 2024",
    description:
      "Routing, switching, TCP/IP protocols, and cybersecurity fundamentals for enterprise networks.",
    outcomes: [
      "Subnet IPv4 networks confidently",
      "Configure VLANs and inter-VLAN routing",
      "Apply core network security controls",
    ],
    tags: ["Routing", "TCP/IP", "Cybersecurity"],
    modules: [
      { title: "Module 1 — Networking Foundations", lessons: [
        { title: "OSI & TCP/IP Models", type: "video", length: "17 min", done: true },
        { title: "Addressing & Subnetting", type: "video", length: "28 min", done: true },
      ]},
      { title: "Module 2 — Switching", lessons: [
        { title: "VLANs & Trunking", type: "video", length: "22 min", done: true },
        { title: "Spanning Tree Protocol", type: "video", length: "19 min", done: true },
      ]},
      { title: "Module 3 — Routing", lessons: [
        { title: "Static & Dynamic Routing", type: "video", length: "25 min", done: true },
      ]},
      { title: "Module 4 — Network Security", lessons: [
        { title: "ACLs & Firewall Basics", type: "video", length: "23 min", done: true },
      ]},
      { title: "Module 5 — Capstone", lessons: [
        { title: "Design an Enterprise Network", type: "reading", length: "40 min", done: true },
      ]},
    ],
  },
  {
    id: "c4",
    title: "Audio Visual Systems",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    instructor: "Eng. Lina",
    progress: 0,
    status: "not-started",
    enrolledOn: "Jun 2026",
    description:
      "Video walls, conferencing systems, and AV system integration for modern spaces.",
    outcomes: [
      "Specify displays and video wall configurations",
      "Design conferencing room AV",
      "Integrate AV with control systems",
    ],
    tags: ["Video Walls", "AV Integration", "Conferencing"],
    modules: [
      { title: "Module 1 — AV Fundamentals", lessons: [
        { title: "Signal Types & Connectors", type: "video", length: "16 min", done: false },
      ]},
      { title: "Module 2 — Displays & Video Walls", lessons: [
        { title: "Display Technologies", type: "video", length: "20 min", done: false },
      ]},
      { title: "Module 3 — Conferencing", lessons: [
        { title: "Room Acoustics & Mics", type: "video", length: "18 min", done: false },
      ]},
      { title: "Module 4 — Control & Integration", lessons: [
        { title: "Control Processors", type: "video", length: "22 min", done: false },
      ]},
      { title: "Module 5 — Project", lessons: [
        { title: "Design a Conference Suite", type: "reading", length: "35 min", done: false },
      ]},
    ],
  },
  {
    id: "c5",
    title: "Building Management Systems",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>',
    instructor: "Eng. Omar",
    progress: 60,
    status: "in-progress",
    enrolledOn: "Oct 2024",
    description:
      "HVAC automation, smart building controls, and energy efficiency systems.",
    outcomes: [
      "Read and produce BMS points lists",
      "Design HVAC control sequences",
      "Apply energy optimization strategies",
    ],
    tags: ["HVAC", "Automation", "Smart Buildings"],
    modules: [
      { title: "Module 1 — BMS Overview", lessons: [
        { title: "What a BMS Controls", type: "video", length: "14 min", done: true },
        { title: "Sensors & Actuators", type: "video", length: "19 min", done: true },
      ]},
      { title: "Module 2 — HVAC Control", lessons: [
        { title: "Control Sequences", type: "video", length: "24 min", done: true },
        { title: "Points Lists & I/O", type: "reading", length: "20 min", done: false },
      ]},
      { title: "Module 3 — Automation", lessons: [
        { title: "Scheduling & Setpoints", type: "video", length: "18 min", done: false },
      ]},
      { title: "Module 4 — Energy Efficiency", lessons: [
        { title: "Optimization Strategies", type: "video", length: "21 min", done: false },
      ]},
      { title: "Module 5 — Integration", lessons: [
        { title: "BMS Network Protocols", type: "video", length: "23 min", done: false },
      ]},
    ],
  },
  {
    id: "c6",
    title: "Data Center Infrastructure",
    icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/></svg>',
    instructor: "Eng. Sara",
    progress: 100,
    status: "completed",
    enrolledOn: "Sept 2024",
    description:
      "Structured cabling, server room design, and enterprise network architecture.",
    outcomes: [
      "Design structured cabling systems",
      "Plan server room power and cooling",
      "Apply data center tier standards",
    ],
    tags: ["Cabling", "Server Rooms", "Network"],
    modules: [
      { title: "Module 1 — Structured Cabling", lessons: [
        { title: "Cabling Standards & Media", type: "video", length: "20 min", done: true },
      ]},
      { title: "Module 2 — Server Rooms", lessons: [
        { title: "Rack Layout & Airflow", type: "video", length: "22 min", done: true },
      ]},
      { title: "Module 3 — Power & Cooling", lessons: [
        { title: "UPS, PDUs & Cooling", type: "video", length: "24 min", done: true },
      ]},
      { title: "Module 4 — Tiers & Redundancy", lessons: [
        { title: "Data Center Tier Levels", type: "video", length: "18 min", done: true },
      ]},
      { title: "Module 5 — Capstone", lessons: [
        { title: "Design a Small Data Center", type: "reading", length: "45 min", done: true },
      ]},
    ],
  },
];

var assignments = [
  { id: "a1", title: "CCTV Coverage Plan", courseId: "c1", dueDate: "2026-06-17", status: "pending", grade: null },
  { id: "a2", title: "Fire Detection Layout (NFPA 72)", courseId: "c2", dueDate: "2026-06-22", status: "pending", grade: null },
  { id: "a3", title: "BMS Points List", courseId: "c5", dueDate: "2026-06-17", status: "pending", grade: null },
  { id: "a4", title: "Access Control Matrix", courseId: "c1", dueDate: "2026-06-05", status: "graded", grade: "A" },
  { id: "a5", title: "Energy Optimization Case Study", courseId: "c5", dueDate: "2026-06-10", status: "submitted", grade: null },
  { id: "a6", title: "VLAN Design Lab Report", courseId: "c3", dueDate: "2026-05-28", status: "graded", grade: "B+" },
  { id: "a7", title: "Subnetting Worksheet", courseId: "c3", dueDate: "2026-05-20", status: "graded", grade: "A" },
];

var liveSessions = [
  { id: "s1", title: "Live Q&A: NFPA Standards", courseId: "c2", instructor: "Eng. Mona", when: "Today, 6:00 PM", joinable: true, countdown: "Starts in 15 min", past: false, platform: "zoom", meetingUrl: "https://zoom.us/j/94628731045" },
  { id: "s2", title: "CCTV Network Integration", courseId: "c1", instructor: "Eng. Karim", when: "Thu, Jun 18 — 5:00 PM", joinable: false, countdown: "Starts in 2 days", past: false, platform: "meet", meetingUrl: "https://meet.google.com/kbd-ozxq-fce" },
  { id: "s3", title: "BMS Controllers Workshop", courseId: "c5", instructor: "Eng. Omar", when: "Sat, Jun 20 — 4:00 PM", joinable: false, countdown: "Starts in 4 days", past: false, platform: "teams", meetingUrl: "https://teams.live.com/9482031846127" },
  { id: "s4", title: "Access Control Deep Dive", courseId: "c1", instructor: "Eng. Karim", when: "Tue, Jun 23 — 6:00 PM", joinable: false, countdown: "Starts in 1 week", past: false, platform: "zoom", meetingUrl: "https://zoom.us/j/91537248064" },
  { id: "s5", title: "Subnetting Masterclass", courseId: "c3", instructor: "Eng. Tarek", when: "Jun 9 — 5:00 PM", duration: "58 min", past: true },
  { id: "s6", title: "VLANs in Practice", courseId: "c3", instructor: "Eng. Tarek", when: "Jun 4 — 5:00 PM", duration: "1h 04m", past: true },
  { id: "s7", title: "Camera Selection Clinic", courseId: "c1", instructor: "Eng. Karim", when: "Jun 2 — 6:00 PM", duration: "47 min", past: true },
  { id: "s8", title: "Intro to BMS Points", courseId: "c5", instructor: "Eng. Omar", when: "May 28 — 4:00 PM", duration: "52 min", past: true },
  { id: "s9", title: "Fire Panel Configuration", courseId: "c2", instructor: "Eng. Mona", when: "May 26 — 6:00 PM", duration: "1h 12m", past: true },
  { id: "s10", title: "Data Center Cooling", courseId: "c6", instructor: "Eng. Sara", when: "May 21 — 5:00 PM", duration: "49 min", past: true },
];

/* Attendance for June 2026 — 16 sessions, 1 absent (~94%) */
var attendanceRecords = [
  { date: "2026-06-01", courseId: "c1", status: "present" },
  { date: "2026-06-02", courseId: "c3", status: "present" },
  { date: "2026-06-03", courseId: "c5", status: "present" },
  { date: "2026-06-04", courseId: "c3", status: "present" },
  { date: "2026-06-07", courseId: "c2", status: "present" },
  { date: "2026-06-08", courseId: "c1", status: "present" },
  { date: "2026-06-09", courseId: "c3", status: "absent" },
  { date: "2026-06-10", courseId: "c5", status: "present" },
  { date: "2026-06-11", courseId: "c2", status: "present" },
  { date: "2026-06-14", courseId: "c1", status: "present" },
  { date: "2026-06-15", courseId: "c5", status: "present" },
  { date: "2026-06-16", courseId: "c1", status: "present" },
  { date: "2026-06-17", courseId: "c2", status: "present" },
  { date: "2026-06-18", courseId: "c1", status: "present" },
  { date: "2026-06-21", courseId: "c5", status: "present" },
  { date: "2026-06-22", courseId: "c2", status: "present" },
];
var overallAttendance = 94;

var grades = [
  { courseId: "c1", assignmentsAvg: "A−", labsAvg: "A", finalGrade: "—", overallGrade: "A−" },
  { courseId: "c2", assignmentsAvg: "B+", labsAvg: "B", finalGrade: "—", overallGrade: "B+" },
  { courseId: "c3", assignmentsAvg: "A", labsAvg: "A−", finalGrade: "A", overallGrade: "A" },
  { courseId: "c5", assignmentsAvg: "B", labsAvg: "B+", finalGrade: "—", overallGrade: "B+" },
  { courseId: "c6", assignmentsAvg: "A−", labsAvg: "A", finalGrade: "A−", overallGrade: "A−" },
];
var overallGrade = "A−";

var certificates = [
  { id: "cert3", courseId: "c3", earned: true, dateEarned: "May 2026", verificationCode: "CORE-2026-NE318" },
  { id: "cert6", courseId: "c6", earned: true, dateEarned: "Jun 2026", verificationCode: "CORE-2026-DC742" },
  { id: "cert1", courseId: "c1", earned: false, dateEarned: null, verificationCode: null },
  { id: "cert2", courseId: "c2", earned: false, dateEarned: null, verificationCode: null },
  { id: "cert5", courseId: "c5", earned: false, dateEarned: null, verificationCode: null },
  { id: "cert4", courseId: "c4", earned: false, dateEarned: null, verificationCode: null },
];

var recentActivity = [
  { icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88"/></svg>', text: "Earned the <strong>Data Center Infrastructure</strong> certificate", time: "2 days ago", cert: true, link: "certificates.html" },
  { icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>', text: "Submitted assignment <strong>Energy Optimization Case Study</strong>", time: "3 days ago", link: "assignments.html?filter=submitted" },
  { icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>', text: "Joined live session <strong>Subnetting Masterclass</strong>", time: "1 week ago", link: "live-sessions.html" },
  { icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>', text: "Received grade <strong>A</strong> on <strong>Subnetting Worksheet</strong>", time: "1 week ago", link: "grades.html" },
  { icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', text: "Completed Module 2 of <strong>Security Systems Engineering</strong>", time: "2 weeks ago", link: "course-detail.html?id=c1" },
];

/* ---- tiny shared lookups ---- */
function courseById(id) { return courses.find(function (c) { return c.id === id; }); }
