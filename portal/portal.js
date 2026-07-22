/* =========================================================
   CORE Egypt — Student Portal SHELL + SHARED LOGIC
   Vanilla JS, no dependencies. Builds the sidebar + header,
   gates access, and provides render helpers used by pages.
   ========================================================= */

/* ---- Navigation definition (single source) ---- */
var PORTAL_NAV = [
  { key: "dashboard",     label: "Dashboard",     icon: "home",       href: "dashboard.html" },
  { key: "courses",       label: "Courses",       icon: "book",       href: "courses.html" },
  { key: "assignments",   label: "Assignments",   icon: "assignment", href: "assignments.html" },
  { key: "live-sessions", label: "Live Sessions", icon: "video",      href: "live-sessions.html" },
  { key: "attendance",    label: "Attendance",    icon: "calendar",   href: "attendance.html" },
  { key: "grades",        label: "Grades",        icon: "chart",      href: "grades.html" },
  { key: "certificates",  label: "Certificates",  icon: "award",      href: "certificates.html" },
  { key: "profile",       label: "Profile",       icon: "user",       href: "profile.html" },
];

/* ---- Notifications shown in the header bell dropdown ---- */
var PORTAL_NOTIFS = [
  { icon: "assignment", text: "<strong>CCTV Coverage Plan</strong> is due tomorrow", href: "assignments.html?filter=pending" },
  { icon: "video", text: "<strong>Live Q&amp;A: NFPA Standards</strong> starts in 15 min", href: "live-sessions.html" },
  { icon: "award", text: "Your <strong>Data Center</strong> certificate is ready", href: "certificates.html" },
];

var PAGE_TITLES = {
  dashboard: "Dashboard",
  courses: "My Courses",
  "course-detail": "Course",
  assignments: "Assignments",
  "live-sessions": "Live Sessions",
  attendance: "Attendance",
  grades: "Grades",
  certificates: "Certificates",
  profile: "Profile",
};

/* ---- Teacher (instructor) portal navigation ---- */
var TEACHER_NAV = [
  { key: "teacher-dashboard",  label: "Dashboard",     icon: "home",     href: "teacher-dashboard.html" },
  { key: "teacher-courses",    label: "My Courses",    icon: "book",     href: "teacher-courses.html" },
  { key: "teacher-students",   label: "Students",      icon: "users",    href: "teacher-students.html" },
  { key: "teacher-grading",    label: "Grading",       icon: "edit",     href: "teacher-grading.html" },
  { key: "teacher-sessions",   label: "Live Sessions", icon: "video",    href: "teacher-sessions.html" },
  { key: "teacher-attendance", label: "Attendance",    icon: "calendar", href: "teacher-attendance.html" },
  { key: "teacher-certificates", label: "Certificates", icon: "award",   href: "teacher-certificates.html" },
  { key: "teacher-reports",    label: "Reports",       icon: "chart",    href: "teacher-reports.html" },
  { key: "teacher-profile",    label: "Profile",       icon: "user",     href: "teacher-profile.html" },
];

/* Admin-only nav entry, appended for admins in buildShell() */
var TEACHER_ADMIN_NAV = { key: "teacher-approvals", label: "Approvals", icon: "shield", href: "teacher-approvals.html" };

var TEACHER_NOTIFS = [
  { icon: "edit", text: "<strong>7 submissions</strong> awaiting your grading", href: "teacher-grading.html" },
  { icon: "video", text: "<strong>CCTV Network Integration</strong> session starts soon", href: "teacher-sessions.html" },
  { icon: "chart", text: "Low attendance flagged in <strong>Fire Alarm Systems</strong>", href: "teacher-reports.html" },
];

var TEACHER_PAGE_TITLES = {
  "teacher-dashboard": "Dashboard",
  "teacher-courses": "My Courses",
  "teacher-course-builder": "Course Builder",
  "teacher-students": "Students",
  "teacher-grading": "Grading",
  "teacher-sessions": "Live Sessions",
  "teacher-attendance": "Attendance",
  "teacher-certificates": "Certificates",
  "teacher-reports": "Reports",
  "teacher-profile": "Profile",
  "teacher-approvals": "Instructor Approvals",
};

/* ---- Session helpers (role-aware) ---- */
function portalLogout() {
  var role;
  try { role = sessionStorage.getItem("role"); } catch (e) {}
  try {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("firstName");
    sessionStorage.removeItem("coreSession");
  } catch (e) {}
  if (typeof dbSignOut === "function") dbSignOut(); // real session too, when db.js is loaded
  window.location.href = role === "teacher" ? "teacher-login.html" : "student-login.html";
}

/* ---- Shared password rule (min 8) ---- */
var PASSWORD_MIN = 8;
function validatePassword(pw) { return String(pw || "").length >= PASSWORD_MIN; }
function passwordTooShortMsg() {
  var rtl = document.documentElement.getAttribute("dir") === "rtl";
  return rtl ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" : "Password must be at least 8 characters";
}

/* Toast notification (shared, used by save actions) */
function showToast(msg) {
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function () { t.classList.add("show"); });
  setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 250); }, 2400);
}

/* ---- Render helpers (used by page inline scripts) ---- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

function avatarHTML(initials, cls) {
  return '<span class="avatar ' + (cls || "") + '">' + esc(initials) + "</span>";
}

function progressHTML(pct, showLabel) {
  var p = Math.max(0, Math.min(100, pct || 0));
  var meta = showLabel ? '<div class="progress-meta"><span>' + t("Progress") + '</span><span>' + p + '%</span></div>' : "";
  return meta + '<div class="progress-bar"><div class="fill" style="width:' + p + '%"></div></div>';
}

var STATUS_BADGES = {
  "in-progress": { cls: "badge-info", label: "In Progress" },
  completed:     { cls: "badge-success", label: "Completed" },
  "not-started": { cls: "badge-neutral", label: "Not Started" },
  pending:       { cls: "badge-warning", label: "Pending" },
  submitted:     { cls: "badge-info", label: "Submitted" },
  graded:        { cls: "badge-success", label: "Graded" },
  present:       { cls: "badge-success", label: "Present" },
  absent:        { cls: "badge-warning", label: "Absent" },
};
function badgeHTML(status) {
  var b = STATUS_BADGES[status] || { cls: "badge-neutral", label: status };
  return '<span class="badge ' + b.cls + '">' + esc(t(b.label)) + "</span>";
}

/* days from TODAY (defined in mock-data.js) to a yyyy-mm-dd date */
function daysUntil(dateStr) {
  if (typeof TODAY === "undefined") return 999;
  var d = new Date(dateStr + "T00:00:00");
  return Math.round((d - new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())) / 86400000);
}
function prettyDate(dateStr) {
  var d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ---- Build the app shell (role-aware) ---- */
function buildShell() {
  var page = document.body.getAttribute("data-page");
  if (!page) return;
  var pageRole = document.body.getAttribute("data-role") === "teacher" ? "teacher" : "student";

  /* gate: must be logged in, and on the correct portal for the role */
  var loggedIn = false, role = "student";
  try {
    loggedIn = sessionStorage.getItem("loggedIn") === "true";
    role = sessionStorage.getItem("role") || "student";
  } catch (e) {}
  if (!loggedIn) { window.location.replace("login.html"); return; }
  if (role !== pageRole) { window.location.replace(role === "teacher" ? "teacher-dashboard.html" : "dashboard.html"); return; }

  var isTeacher = pageRole === "teacher";
  var nav = isTeacher ? TEACHER_NAV : PORTAL_NAV;
  /* admins also get the instructor-approval screen */
  if (isTeacher && typeof currentInstructor !== "undefined" && currentInstructor.isAdmin) {
    nav = nav.concat([TEACHER_ADMIN_NAV]);
  }
  var notifs = isTeacher ? TEACHER_NOTIFS : PORTAL_NOTIFS;
  var titles = isTeacher ? TEACHER_PAGE_TITLES : PAGE_TITLES;
  var profileHref = isTeacher ? "teacher-profile.html" : "profile.html";
  var person = isTeacher
    ? (typeof currentInstructor !== "undefined" ? currentInstructor : { name: "Instructor", avatarInitials: "I" })
    : (typeof currentStudent !== "undefined" ? currentStudent : { name: "Student", avatarInitials: "S" });

  var activeKey = page;
  if (page === "course-detail") activeKey = "courses";
  if (page === "teacher-course-builder") activeKey = "teacher-courses";

  /* Sidebar */
  var sidebar = document.getElementById("portalSidebar");
  if (sidebar) {
    var navHTML = nav.map(function (n) {
      return '<li><a href="' + n.href + '" class="' + (n.key === activeKey ? "active" : "") + '">' +
             '<span class="ico" aria-hidden="true">' + ICON(n.icon) + "</span>" + esc(t(n.label)) + "</a></li>";
    }).join("");
    var pill = isTeacher ? ' <span class="teacher-pill">' + t("Instructor") + "</span>" : "";
    sidebar.innerHTML =
      '<div class="portal-brand"><span class="brand-mark">C</span><span>CORE Egypt</span>' + pill + "</div>" +
      '<ul class="portal-nav">' + navHTML + "</ul>" +
      '<div class="portal-userbox">' + avatarHTML(person.avatarInitials, "avatar-sm") +
        '<div class="meta"><b>' + esc(person.name) + "</b>" +
        '<a href="#" data-logout>' + t("Log Out") + "</a></div></div>";
  }

  /* Header */
  var header = document.getElementById("portalHeader");
  if (header) {
    var title = t(document.body.getAttribute("data-title") || titles[page] || "Portal");
    var notifItems = notifs.map(function (n) {
      return '<a href="' + n.href + '"><span class="ico" aria-hidden="true" style="display:inline-flex;vertical-align:middle;margin-inline-end:8px;">' + ICON(n.icon, 16) + "</span>" + n.text + "</a>";
    }).join("");
    header.innerHTML =
      '<div class="ph-left">' +
        '<button class="portal-hamburger" data-toggle-sidebar aria-label="' + t("Menu") + '">' + ICON("menu", 18) + "</button>" +
        "<h1>" + esc(title) + "</h1>" +
      "</div>" +
      '<div class="ph-right">' +
        langToggleHTML() +
        '<div class="portal-notif" style="position:relative;">' +
          '<button class="icon-btn" data-dropdown-toggle="notifMenu" aria-label="' + t("Notifications") + '" title="' + t("Notifications") + '">' + ICON("bell", 18) + '<span class="dot"></span></button>' +
          '<div class="dropdown" id="notifMenu" style="min-width:300px;">' +
            '<div style="padding:8px 12px;font-weight:800;color:var(--core-navy);">' + t("Notifications") + "</div>" +
            notifItems +
          "</div>" +
        "</div>" +
        '<div class="portal-usermenu">' +
          '<button class="trigger" data-dropdown-toggle="userMenu" aria-haspopup="true">' +
            avatarHTML(person.avatarInitials, "avatar-sm") + "<b>" + esc(person.name) + '</b><span class="caret">▾</span>' +
          "</button>" +
          '<div class="dropdown" id="userMenu">' +
            '<a href="' + profileHref + '">' + t("Profile") + "</a>" +
            '<a href="' + profileHref + '#security">' + t("Settings") + "</a>" +
            '<a href="#" data-logout>' + t("Log Out") + "</a>" +
          "</div>" +
        "</div>" +
      "</div>";
  }
}

/* =========================================================
   CONTENT PROTECTION MODULE
   SECURITY NOTE: Browser JavaScript CANNOT truly block OS-level
   screenshots or a phone camera. Everything below is a DETERRENT +
   TRACEABILITY layer only (anti-copy, watermark, print/keyboard hints).
   All checks are centralized here so they can be swapped for real
   server-side enforcement (Firebase Storage rules / signed URLs) in
   the backend phase.
   ========================================================= */

/* Who is logged in right now (student or instructor mock user) */
function getCurrentUser() {
  var role;
  try { role = sessionStorage.getItem("role"); } catch (e) {}
  if (role === "teacher" && typeof currentInstructor !== "undefined") return currentInstructor;
  if (typeof currentStudent !== "undefined") return currentStudent;
  return { name: "User", id: "—" };
}
function firstName(n) { return String(n || "").trim().replace(/^Eng\.\s*/, "").split(/\s+/)[0] || "User"; }

/* Admin-only download gate. Swap for a server check in the backend phase. */
function canDownload() {
  // admin-only: role === "teacher" && currentUser.isAdmin === true
  var role;
  try { role = sessionStorage.getItem("role"); } catch (e) {}
  if (role !== "teacher") return false;
  return (typeof currentInstructor !== "undefined") && currentInstructor.isAdmin === true;
}
function downloadLockHTML() {
  var rtl = document.documentElement.getAttribute("dir") === "rtl";
  return '<span class="download-lock">' + ICON("lock", 15) + ' ' + (rtl ? "التنزيل يتطلب صلاحية المشرف" : "Downloads require admin access") + "</span>";
}

/* Wrap protected material: watermark + anti-copy + print/screenshot deterrents.
   Scoped to .protected-content only — never touches the rest of the app. */
function initContentProtection() {
  var wraps = document.querySelectorAll(".protected-content");
  if (!wraps.length) return;

  var user = getCurrentUser();
  var stamp = firstName(user.name) + " • " + (user.id || "—") + " • " + new Date().toLocaleDateString();

  wraps.forEach(function (w) {
    if (w.getAttribute("data-protected") === "1") return;
    w.setAttribute("data-protected", "1");
    // dynamic diagonal watermark (the real deterrent — traceable to the user)
    var wm = document.createElement("div");
    wm.className = "protected-watermark";
    wm.setAttribute("aria-hidden", "true");
    var cells = "";
    for (var i = 0; i < 60; i++) cells += "<span>" + esc(stamp) + "</span>";
    wm.innerHTML = cells;
    w.appendChild(wm);
    // block copy / cut / drag / right-click inside the wrapper
    ["contextmenu", "copy", "cut", "dragstart"].forEach(function (ev) {
      w.addEventListener(ev, function (e) { e.preventDefault(); });
    });
  });

  // Ctrl/Cmd + S / P guards
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "p")) {
      e.preventDefault();
      showToast("Saving and printing are disabled for course materials");
    }
  });
  // Best-effort screenshot deterrent (Windows PrintScreen only)
  document.addEventListener("keyup", function (e) {
    if (e.key === "PrintScreen") {
      wraps.forEach(function (w) { w.classList.add("blurred"); });
      showToast("Screenshots are not permitted.");
      setTimeout(function () { wraps.forEach(function (w) { w.classList.remove("blurred"); }); }, 2000);
    }
  });
  // Print-only "protected" message
  if (!document.querySelector(".print-block")) {
    var pb = document.createElement("div");
    pb.className = "print-block";
    pb.textContent = "This material is protected and cannot be printed.";
    document.body.appendChild(pb);
  }
}

/* ---- Global delegated interactions ---- */
document.addEventListener("click", function (e) {
  var t = e.target;

  /* logout */
  var lo = t.closest("[data-logout]");
  if (lo) { e.preventDefault(); portalLogout(); return; }

  /* sidebar drawer */
  if (t.closest("[data-toggle-sidebar]")) {
    document.getElementById("portalSidebar").classList.toggle("open");
    document.getElementById("portalOverlay").classList.toggle("open");
    return;
  }
  if (t.id === "portalOverlay") {
    document.getElementById("portalSidebar").classList.remove("open");
    t.classList.remove("open");
    return;
  }

  /* dropdown */
  var dd = t.closest("[data-dropdown-toggle]");
  if (dd) {
    e.preventDefault();
    var menu = document.getElementById(dd.getAttribute("data-dropdown-toggle"));
    if (menu) menu.classList.toggle("open");
    return;
  } else {
    document.querySelectorAll(".dropdown.open").forEach(function (m) { m.classList.remove("open"); });
  }

  /* in-page tabs */
  var tab = t.closest("[data-tab]");
  if (tab) {
    var group = tab.getAttribute("data-tab-group");
    document.querySelectorAll('[data-tab-group="' + group + '"]').forEach(function (b) { b.classList.remove("active"); });
    tab.classList.add("active");
    var panelId = tab.getAttribute("data-tab");
    document.querySelectorAll('[data-tab-panel-group="' + group + '"]').forEach(function (p) { p.classList.remove("active"); });
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add("active");
    return;
  }

  /* accordion */
  var acc = t.closest(".accordion-head");
  if (acc) { acc.closest(".accordion-item").classList.toggle("open"); return; }

  /* modal open */
  var mo = t.closest("[data-modal-open]");
  if (mo) { e.preventDefault(); var m = document.getElementById(mo.getAttribute("data-modal-open")); if (m) m.classList.add("open"); return; }

  /* modal close (button or backdrop) */
  if (t.closest("[data-modal-close]") || t.classList.contains("backdrop")) {
    var open = t.closest(".portal-modal"); if (open) open.classList.remove("open"); return;
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") document.querySelectorAll(".portal-modal.open").forEach(function (m) { m.classList.remove("open"); });
});

/* ---- Page bootstrap ----
   Pages wrap their render code in portalBoot(render). With a live
   database it loads real data first (overwriting the mock globals),
   rebuilds the shell with the real user, then renders. In demo mode
   it renders immediately from the mock data. */
function portalBoot(render) {
  var isDb = typeof dbReady === "function" && dbReady();
  if (!isDb) { render(); return; }
  var pageRole = document.body.getAttribute("data-role") === "teacher" ? "teacher" : "student";
  var loader = pageRole === "teacher" ? dbLoadTeacherData : dbLoadStudentData;
  loader(function (err) {
    if (err) {
      console.warn("Database load failed — showing demo data:", err);
      showToast("Could not load live data — showing demo data");
    }
    buildShell(); // refresh sidebar/header with the real user
    render();
    initContentProtection(); // protect any material the render created
  });
}

/* Build immediately (scripts are loaded at end of <body>, DOM is ready) */
buildShell();
/* Protect materials after page inline scripts have rendered their content */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initContentProtection);
else initContentProtection();
