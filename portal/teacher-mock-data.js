/* =========================================================
   CORE Egypt — TEACHER (Instructor) MOCK DATA
   Frontend-only. Cross-consistent with mock-data.js:
   same course titles + the same student (Youssef).
   ========================================================= */

var currentInstructor = {
  name: "Eng. Karim",
  id: "IN-2019-014",
  email: "karim@coreegypt.com",
  phone: "+20 100 444 0142",
  disciplines: ["Security Systems", "Networking", "Fire Safety"],
  avatarInitials: "K",
  teachingSince: "Feb 2019",
  isAdmin: true, // Head of Academy — the only account allowed to download files (see canDownload())
  bio: "Head of Academy. Senior security & networking engineer with 12 years of field experience across CCTV, access control, and enterprise networks.",
};

/* Courses owned by this instructor (subset of the 6 CORE programs) */
var teacherCourses = [
  { id: "tc1", title: "Security Systems Engineering", icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', programType: "Security", status: "published", enrolledCount: 32, avgProgress: 68, avgGrade: "A−", avgGradePct: 90, avgAttendance: 93 },
  { id: "tc2", title: "Fire Alarm Systems Engineering", icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3.5C10 8 12 6 12 2z"/><path d="M9 14a3 3 0 0 0 6 0c0-2-2-3-3-5-1 2-3 3-3 5z"/></svg>', programType: "Fire Safety", status: "published", enrolledCount: 28, avgProgress: 54, avgGrade: "B", avgGradePct: 83, avgAttendance: 78 },
  { id: "tc3", title: "Network Engineering", icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', programType: "Networking", status: "published", enrolledCount: 27, avgProgress: 81, avgGrade: "A", avgGradePct: 95, avgAttendance: 90 },
  { id: "tc4", title: "Building Management Systems", icon: '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>', programType: "Automation", status: "draft", enrolledCount: 0, avgProgress: 0, avgGrade: "—", avgGradePct: 0, avgAttendance: 0 },
];

/* Students taught by this instructor (Youssef = the student-side user) */
var teacherStudents = [
  { id: "CA-2024-0317", name: "Youssef", avatarInitials: "Y", courseIds: ["tc1"],        progress: 75, grade: "A−", attendanceRate: 94 },
  { id: "CA-2024-0291", name: "Nour",    avatarInitials: "N", courseIds: ["tc1", "tc3"], progress: 82, grade: "A",  attendanceRate: 96 },
  { id: "CA-2024-0334", name: "Omar",    avatarInitials: "O", courseIds: ["tc2"],        progress: 47, grade: "B",  attendanceRate: 88 },
  { id: "CA-2024-0302", name: "Salma",   avatarInitials: "S", courseIds: ["tc1"],        progress: 63, grade: "B+", attendanceRate: 91 },
  { id: "CA-2024-0278", name: "Mariam",  avatarInitials: "M", courseIds: ["tc3"],        progress: 90, grade: "A",  attendanceRate: 98 },
  { id: "CA-2024-0345", name: "Ahmed",   avatarInitials: "A", courseIds: ["tc2", "tc3"], progress: 55, grade: "B−", attendanceRate: 79 },
  { id: "CA-2024-0319", name: "Laila",   avatarInitials: "L", courseIds: ["tc1"],        progress: 38, grade: "C+", attendanceRate: 72 },
  { id: "CA-2024-0263", name: "Khaled",  avatarInitials: "K", courseIds: ["tc3"],        progress: 71, grade: "B+", attendanceRate: 90 },
  { id: "CA-2024-0357", name: "Hana",    avatarInitials: "H", courseIds: ["tc2"],        progress: 66, grade: "B",  attendanceRate: 85 },
  { id: "CA-2024-0288", name: "Tamer",   avatarInitials: "T", courseIds: ["tc1", "tc2"], progress: 80, grade: "A−", attendanceRate: 93 },
  { id: "CA-2024-0371", name: "Farida",  avatarInitials: "F", courseIds: ["tc3"],        progress: 59, grade: "B",  attendanceRate: 87 },
  { id: "CA-2024-0399", name: "Ziad",    avatarInitials: "Z", courseIds: ["tc2"],        progress: 44, grade: "C",  attendanceRate: 68 },
];

/* Submissions queue */
var submissions = [
  { id: "sub1", studentId: "CA-2024-0317", assignmentTitle: "CCTV Coverage Plan",            courseId: "tc1", submittedDate: "2026-06-15", status: "ungraded", score: null, maxPoints: 100 },
  { id: "sub2", studentId: "CA-2024-0302", assignmentTitle: "Access Control Matrix",          courseId: "tc1", submittedDate: "2026-06-15", status: "ungraded", score: null, maxPoints: 100 },
  { id: "sub3", studentId: "CA-2024-0334", assignmentTitle: "Fire Detection Layout (NFPA 72)", courseId: "tc2", submittedDate: "2026-06-14", status: "ungraded", score: null, maxPoints: 50 },
  { id: "sub4", studentId: "CA-2024-0357", assignmentTitle: "Notification Appliance Sizing",  courseId: "tc2", submittedDate: "2026-06-14", status: "ungraded", score: null, maxPoints: 50 },
  { id: "sub5", studentId: "CA-2024-0278", assignmentTitle: "VLAN Design Lab Report",         courseId: "tc3", submittedDate: "2026-06-13", status: "ungraded", score: null, maxPoints: 100 },
  { id: "sub6", studentId: "CA-2024-0263", assignmentTitle: "Subnetting Worksheet",           courseId: "tc3", submittedDate: "2026-06-13", status: "ungraded", score: null, maxPoints: 40 },
  { id: "sub7", studentId: "CA-2024-0319", assignmentTitle: "CCTV Coverage Plan",             courseId: "tc1", submittedDate: "2026-06-12", status: "ungraded", score: null, maxPoints: 100 },
  { id: "sub8", studentId: "CA-2024-0291", assignmentTitle: "Subnetting Worksheet",           courseId: "tc3", submittedDate: "2026-06-10", status: "graded",   score: 38,   maxPoints: 40 },
  { id: "sub9", studentId: "CA-2024-0345", assignmentTitle: "VLAN Design Lab Report",         courseId: "tc3", submittedDate: "2026-06-09", status: "graded",   score: 81,   maxPoints: 100 },
  { id: "sub10", studentId: "CA-2024-0288", assignmentTitle: "Access Control Matrix",         courseId: "tc1", submittedDate: "2026-06-08", status: "graded",   score: 92,   maxPoints: 100 },
];

/* Live sessions (instructor-hosted) */
var teacherSessions = [
  { id: "ts1", title: "CCTV Network Integration", courseId: "tc1", when: "Today — 5:00 PM",        time: "5:00 PM", today: true,  status: "upcoming", enrolledCount: 32, attendedCount: null, platform: "meet",  meetingUrl: "https://meet.google.com/kbd-ozxq-fce" },
  { id: "ts2", title: "Live Q&A: NFPA Standards", courseId: "tc2", when: "Today — 6:30 PM",        time: "6:30 PM", today: true,  status: "upcoming", enrolledCount: 28, attendedCount: null, platform: "zoom",  meetingUrl: "https://zoom.us/j/94628731045" },
  { id: "ts3", title: "Routing Deep Dive",        courseId: "tc3", when: "Thu, Jun 18 — 5:00 PM",  time: "5:00 PM", today: false, status: "upcoming", enrolledCount: 27, attendedCount: null, platform: "teams", meetingUrl: "https://teams.live.com/meet/9482031846127" },
  { id: "ts4", title: "Camera Selection Clinic",  courseId: "tc1", when: "Jun 2 — 6:00 PM",        status: "past", enrolledCount: 32, attendedCount: 29 },
  { id: "ts5", title: "VLANs in Practice",        courseId: "tc3", when: "Jun 4 — 5:00 PM",        status: "past", enrolledCount: 27, attendedCount: 25 },
  { id: "ts6", title: "Fire Panel Configuration", courseId: "tc2", when: "May 26 — 6:00 PM",       status: "past", enrolledCount: 28, attendedCount: 22 },
  { id: "ts7", title: "Subnetting Masterclass",   courseId: "tc3", when: "Jun 9 — 5:00 PM",        status: "past", enrolledCount: 27, attendedCount: 26 },
  { id: "ts8", title: "Intro to Access Control",  courseId: "tc1", when: "May 21 — 6:00 PM",       status: "past", enrolledCount: 32, attendedCount: 30 },
];

/* Reporting metrics */
var reportMetrics = {
  avgGrade: "B+",
  completionRate: 74,
  avgAttendance: 88,
  submissionRate: 91,
  gradeDistribution: { A: 18, B: 34, C: 22, D: 9, F: 4 },
  attendanceTrend: [82, 85, 80, 88, 90, 87, 91], // by week
  assignmentCompletion: [
    { title: "CCTV Coverage Plan", pct: 84 },
    { title: "Access Control Matrix", pct: 92 },
    { title: "Fire Detection Layout", pct: 71 },
    { title: "VLAN Design Lab Report", pct: 88 },
    { title: "Subnetting Worksheet", pct: 95 },
  ],
};

/* ---- shared lookups ---- */
function teacherCourseById(id) { return teacherCourses.find(function (c) { return c.id === id; }); }
function teacherStudentById(id) { return teacherStudents.find(function (s) { return s.id === id; }); }
