/* =========================================================
   CORE Academy — TEACHER (Instructor) MOCK DATA
   Frontend-only. Cross-consistent with mock-data.js:
   same course titles + the same student (Youssef Hassan).
   ========================================================= */

const currentInstructor = {
  name: "Eng. Karim Adel",
  id: "IN-2019-014",
  email: "karim.adel@coreacademy.com",
  phone: "+20 100 444 0142",
  disciplines: ["Security Systems", "Networking", "Fire Safety"],
  avatarInitials: "KA",
  teachingSince: "Feb 2019",
  bio: "Senior security & networking engineer turned instructor. 12 years of field experience across CCTV, access control, and enterprise networks.",
};

/* Courses owned by this instructor (subset of the 6 CORE programs) */
const teacherCourses = [
  { id: "tc1", title: "Security Systems Engineering", icon: "🛡️", programType: "Security", status: "published", enrolledCount: 32, avgProgress: 68, avgGrade: "A−", avgGradePct: 90, avgAttendance: 93 },
  { id: "tc2", title: "Fire Alarm Systems Engineering", icon: "🔥", programType: "Fire Safety", status: "published", enrolledCount: 28, avgProgress: 54, avgGrade: "B", avgGradePct: 83, avgAttendance: 78 },
  { id: "tc3", title: "Network Engineering", icon: "🌐", programType: "Networking", status: "published", enrolledCount: 27, avgProgress: 81, avgGrade: "A", avgGradePct: 95, avgAttendance: 90 },
  { id: "tc4", title: "Building Management Systems", icon: "🏢", programType: "Automation", status: "draft", enrolledCount: 0, avgProgress: 0, avgGrade: "—", avgGradePct: 0, avgAttendance: 0 },
];

/* Students taught by this instructor (Youssef Hassan = the student-side user) */
const teacherStudents = [
  { id: "CA-2024-0317", name: "Youssef Hassan",  avatarInitials: "YH", courseIds: ["tc1"],        progress: 75, grade: "A−", attendanceRate: 94 },
  { id: "CA-2024-0291", name: "Nour Ibrahim",    avatarInitials: "NI", courseIds: ["tc1", "tc3"], progress: 82, grade: "A",  attendanceRate: 96 },
  { id: "CA-2024-0334", name: "Omar Khaled",     avatarInitials: "OK", courseIds: ["tc2"],        progress: 47, grade: "B",  attendanceRate: 88 },
  { id: "CA-2024-0302", name: "Salma Adel",      avatarInitials: "SA", courseIds: ["tc1"],        progress: 63, grade: "B+", attendanceRate: 91 },
  { id: "CA-2024-0278", name: "Mariam Tarek",    avatarInitials: "MT", courseIds: ["tc3"],        progress: 90, grade: "A",  attendanceRate: 98 },
  { id: "CA-2024-0345", name: "Ahmed Sami",      avatarInitials: "AS", courseIds: ["tc2", "tc3"], progress: 55, grade: "B−", attendanceRate: 79 },
  { id: "CA-2024-0319", name: "Laila Mostafa",   avatarInitials: "LM", courseIds: ["tc1"],        progress: 38, grade: "C+", attendanceRate: 72 },
  { id: "CA-2024-0263", name: "Khaled Nabil",    avatarInitials: "KN", courseIds: ["tc3"],        progress: 71, grade: "B+", attendanceRate: 90 },
  { id: "CA-2024-0357", name: "Hana Yasser",     avatarInitials: "HY", courseIds: ["tc2"],        progress: 66, grade: "B",  attendanceRate: 85 },
  { id: "CA-2024-0288", name: "Omar Fathy",      avatarInitials: "OF", courseIds: ["tc1", "tc2"], progress: 80, grade: "A−", attendanceRate: 93 },
  { id: "CA-2024-0371", name: "Farida Gamal",    avatarInitials: "FG", courseIds: ["tc3"],        progress: 59, grade: "B",  attendanceRate: 87 },
  { id: "CA-2024-0399", name: "Ziad Mahmoud",    avatarInitials: "ZM", courseIds: ["tc2"],        progress: 44, grade: "C",  attendanceRate: 68 },
];

/* Submissions queue */
let submissions = [
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
let teacherSessions = [
  { id: "ts1", title: "CCTV Network Integration", courseId: "tc1", when: "Today — 5:00 PM",        time: "5:00 PM", today: true,  status: "upcoming", enrolledCount: 32, attendedCount: null },
  { id: "ts2", title: "Live Q&A: NFPA Standards", courseId: "tc2", when: "Today — 6:30 PM",        time: "6:30 PM", today: true,  status: "upcoming", enrolledCount: 28, attendedCount: null },
  { id: "ts3", title: "Routing Deep Dive",        courseId: "tc3", when: "Thu, Jun 18 — 5:00 PM",  time: "5:00 PM", today: false, status: "upcoming", enrolledCount: 27, attendedCount: null },
  { id: "ts4", title: "Camera Selection Clinic",  courseId: "tc1", when: "Jun 2 — 6:00 PM",        status: "past", enrolledCount: 32, attendedCount: 29 },
  { id: "ts5", title: "VLANs in Practice",        courseId: "tc3", when: "Jun 4 — 5:00 PM",        status: "past", enrolledCount: 27, attendedCount: 25 },
  { id: "ts6", title: "Fire Panel Configuration", courseId: "tc2", when: "May 26 — 6:00 PM",       status: "past", enrolledCount: 28, attendedCount: 22 },
  { id: "ts7", title: "Subnetting Masterclass",   courseId: "tc3", when: "Jun 9 — 5:00 PM",        status: "past", enrolledCount: 27, attendedCount: 26 },
  { id: "ts8", title: "Intro to Access Control",  courseId: "tc1", when: "May 21 — 6:00 PM",       status: "past", enrolledCount: 32, attendedCount: 30 },
];

/* Reporting metrics */
const reportMetrics = {
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
