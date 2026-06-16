/* =========================================================
   CORE Academy — Student Portal SHELL + SHARED LOGIC
   Vanilla JS, no dependencies. Builds the sidebar + header,
   gates access, and provides render helpers used by pages.
   ========================================================= */

/* ---- Navigation definition (single source) ---- */
var PORTAL_NAV = [
  { key: "dashboard",     label: "Dashboard",     icon: "🏠", href: "dashboard.html" },
  { key: "courses",       label: "Courses",       icon: "📚", href: "courses.html" },
  { key: "assignments",   label: "Assignments",   icon: "📝", href: "assignments.html" },
  { key: "live-sessions", label: "Live Sessions", icon: "🎥", href: "live-sessions.html" },
  { key: "attendance",    label: "Attendance",    icon: "📅", href: "attendance.html" },
  { key: "grades",        label: "Grades",        icon: "📊", href: "grades.html" },
  { key: "certificates",  label: "Certificates",  icon: "🎓", href: "certificates.html" },
  { key: "profile",       label: "Profile",       icon: "👤", href: "profile.html" },
];

/* ---- Notifications shown in the header bell dropdown ---- */
var PORTAL_NOTIFS = [
  { icon: "📝", text: "<strong>CCTV Coverage Plan</strong> is due tomorrow", href: "assignments.html?filter=pending" },
  { icon: "🎥", text: "<strong>Live Q&amp;A: NFPA Standards</strong> starts in 15 min", href: "live-sessions.html" },
  { icon: "🎓", text: "Your <strong>Data Center</strong> certificate is ready", href: "certificates.html" },
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

/* ---- Session helpers ---- */
function portalLogout() {
  try { sessionStorage.removeItem("coreSession"); } catch (e) {}
  window.location.href = "login.html";
}

/* ---- Render helpers (used by page inline scripts) ---- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

function avatarHTML(initials, cls) {
  return '<span class="avatar ' + (cls || "") + '">' + esc(initials) + "</span>";
}

function progressHTML(pct, showLabel) {
  var p = Math.max(0, Math.min(100, pct || 0));
  var meta = showLabel ? '<div class="progress-meta"><span>Progress</span><span>' + p + '%</span></div>' : "";
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
  return '<span class="badge ' + b.cls + '">' + esc(b.label) + "</span>";
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

/* ---- Build the app shell ---- */
function buildShell() {
  var page = document.body.getAttribute("data-page");
  if (!page) return;

  /* gate: must be "logged in" to view portal pages */
  var hasSession = false;
  try { hasSession = sessionStorage.getItem("coreSession") === "1"; } catch (e) {}
  if (!hasSession) { window.location.replace("login.html"); return; }

  var student = (typeof currentStudent !== "undefined") ? currentStudent : { name: "Student", avatarInitials: "S", program: "" };

  /* Sidebar */
  var sidebar = document.getElementById("portalSidebar");
  var activeKey = page === "course-detail" ? "courses" : page;
  if (sidebar) {
    var nav = PORTAL_NAV.map(function (n) {
      return '<li><a href="' + n.href + '" class="' + (n.key === activeKey ? "active" : "") + '">' +
             '<span class="ico" aria-hidden="true">' + n.icon + "</span>" + esc(n.label) + "</a></li>";
    }).join("");
    sidebar.innerHTML =
      '<div class="portal-brand"><span class="brand-mark">C</span><span>CORE Academy</span></div>' +
      '<ul class="portal-nav">' + nav + "</ul>" +
      '<div class="portal-userbox">' + avatarHTML(student.avatarInitials, "avatar-sm") +
        '<div class="meta"><b>' + esc(student.name) + "</b>" +
        '<a href="#" data-logout>Log Out</a></div></div>';
  }

  /* Header */
  var header = document.getElementById("portalHeader");
  if (header) {
    var title = document.body.getAttribute("data-title") || PAGE_TITLES[page] || "Portal";
    var notifItems = PORTAL_NOTIFS.map(function (n) {
      return '<a href="' + n.href + '"><span class="ico" aria-hidden="true" style="margin-right:8px;">' + n.icon + "</span>" + n.text + "</a>";
    }).join("");
    header.innerHTML =
      '<div class="ph-left">' +
        '<button class="portal-hamburger" data-toggle-sidebar aria-label="Toggle navigation">☰</button>' +
        "<h1>" + esc(title) + "</h1>" +
      "</div>" +
      '<div class="ph-right">' +
        '<div class="portal-notif" style="position:relative;">' +
          '<button class="icon-btn" data-dropdown-toggle="notifMenu" aria-label="Notifications" title="Notifications">🔔<span class="dot"></span></button>' +
          '<div class="dropdown" id="notifMenu" style="min-width:300px;">' +
            '<div style="padding:8px 12px;font-weight:800;color:var(--core-navy);">Notifications</div>' +
            notifItems +
          "</div>" +
        "</div>" +
        '<div class="portal-usermenu">' +
          '<button class="trigger" data-dropdown-toggle="userMenu" aria-haspopup="true">' +
            avatarHTML(student.avatarInitials, "avatar-sm") + "<b>" + esc(student.name) + '</b><span class="caret">▾</span>' +
          "</button>" +
          '<div class="dropdown" id="userMenu">' +
            '<a href="profile.html">Profile</a>' +
            '<a href="profile.html#security">Settings</a>' +
            '<a href="#" data-logout>Log Out</a>' +
          "</div>" +
        "</div>" +
      "</div>";
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

/* Build immediately (scripts are loaded at end of <body>, DOM is ready) */
buildShell();
