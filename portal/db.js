/* =========================================================
   CORE Egypt — DATABASE CLIENT LAYER (Supabase)

   Fill in the two constants below (Supabase Dashboard → Project
   Settings → API) and real accounts/auth/data switch on.
   While they are empty, every page keeps working in DEMO mode
   (mock data, any login succeeds) — nothing breaks.

   The anon key is PUBLIC by design — safe to ship in the frontend.
   All real protection lives in the Row Level Security policies
   (db/schema.sql), never in this file.
   ========================================================= */

var SUPABASE_URL = "https://xvlgczudaxdxtxhckvlu.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_xCGMJkUhqsCJLgD3YwZg_Q_cmD-aFrM"; // publishable key — public by design

var sb = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function dbReady() { return !!sb; }

/* ---------- AUTH ---------- */

/* Sign in for a specific portal. Verifies the account's role matches
   the portal being used (student page vs teacher page). */
function dbSignIn(email, password, wantedRole, done) {
  sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
    if (res.error) { done(res.error.message); return; }
    sb.from("profiles").select("role, first_name").eq("id", res.data.user.id).single().then(function (p) {
      if (p.error) { done("Could not load your profile — try again"); return; }
      if (p.data.role === "pending_teacher") {
        sb.auth.signOut();
        done("Your instructor account is awaiting approval by an administrator.");
        return;
      }
      var role = p.data.role === "admin" ? "teacher" : p.data.role; // admins use the teacher portal
      if (role !== wantedRole) {
        sb.auth.signOut();
        done(wantedRole === "student"
          ? "This is an instructor account — use the Teacher login"
          : "This is a student account — use the Student login");
        return;
      }
      try {
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("role", wantedRole);
        sessionStorage.setItem("firstName", p.data.first_name || "");
      } catch (e) {}
      done(null);
    });
  });
}

/* Sign up with first name + role (role lands in the profiles table via
   the handle_new_user trigger; 'admin' can never be self-assigned). */
function dbSignUp(email, password, firstName, role, done) {
  sb.auth.signUp({
    email: email,
    password: password,
    options: { data: { first_name: firstName, role: role } },
  }).then(function (res) {
    if (res.error) { done(res.error.message); return; }
    // If email confirmation is ON in Supabase, there is no session yet.
    if (!res.data.session) { done(null, "confirm"); return; }
    try {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("firstName", firstName);
    } catch (e) {}
    done(null, "session");
  });
}

function dbSignOut() { if (sb) sb.auth.signOut(); }

/* ---------- DATA (used as pages are wired to real data) ---------- */

function dbMyProfile(done) {
  sb.auth.getUser().then(function (u) {
    if (!u.data.user) { done("Not signed in"); return; }
    sb.from("profiles").select("*").eq("id", u.data.user.id).single()
      .then(function (r) { done(r.error && r.error.message, r.data); });
  });
}

function dbCourses(done) {
  sb.from("courses").select("*, modules(*, lessons(*))").order("title")
    .then(function (r) { done(r.error && r.error.message, r.data); });
}

function dbMyEnrollments(done) {
  sb.from("enrollments").select("*, courses(*)")
    .then(function (r) { done(r.error && r.error.message, r.data); });
}

function dbEnroll(courseId, done) {
  sb.auth.getUser().then(function (u) {
    sb.from("enrollments").insert({ student_id: u.data.user.id, course_id: courseId })
      .then(function (r) { done(r.error && r.error.message); });
  });
}

function dbVerifyCertificate(code, done) {
  sb.rpc("verify_certificate", { code: code })
    .then(function (r) { done(r.error && r.error.message, r.data && r.data[0]); });
}

/* =========================================================
   PHASE 2 — REAL DATA LOADERS
   When the database is connected, these fetch live data and
   overwrite the mock globals IN THE SAME SHAPES the pages
   already render. Pages call portalBoot(render) (portal.js),
   which runs the right loader first. Demo mode = no-op.
   ========================================================= */

function gradeLetter(pct) {
  if (pct == null || isNaN(pct)) return "—";
  if (pct >= 93) return "A"; if (pct >= 90) return "A−"; if (pct >= 87) return "B+";
  if (pct >= 83) return "B"; if (pct >= 80) return "B−"; if (pct >= 77) return "C+";
  if (pct >= 73) return "C"; if (pct >= 60) return "D"; return "F";
}
function fmtWhen(ts) {
  var d = new Date(ts);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " — " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function fmtTime(ts) { return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function isSameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function ymd(d) { d = new Date(d); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function monthYear(ts) { return new Date(ts).toLocaleDateString("en-US", { month: "short", year: "numeric" }); }
function countdownText(ts) {
  var mins = Math.round((new Date(ts) - new Date()) / 60000);
  if (mins <= 0) return "In progress";
  if (mins < 60) return "Starts in " + mins + " min";
  if (mins < 1440) return "Starts in " + Math.round(mins / 60) + " h";
  var days = Math.round(mins / 1440);
  return "Starts in " + days + " day" + (days > 1 ? "s" : "");
}

/* ---------- STUDENT LOADER ---------- */
function dbLoadStudentData(done) {
  sb.auth.getUser().then(function (u) {
    var user = u.data.user;
    if (!user) { portalLogout(); return; }
    Promise.all([
      sb.from("profiles").select("*").eq("id", user.id).single(),
      sb.from("courses").select("*, instructor:profiles(first_name), modules(*, lessons(*))").order("title"),
      sb.from("enrollments").select("*"),
      sb.from("lesson_completions").select("lesson_id"),
      sb.from("assignments").select("*"),
      sb.from("submissions").select("*").eq("student_id", user.id),
      sb.from("live_sessions").select("*"),
      sb.from("attendance").select("*, session:live_sessions(starts_at, course_id)").eq("student_id", user.id),
      sb.from("certificates").select("*").eq("student_id", user.id),
    ]).then(function (r) {
      for (var i = 0; i < r.length; i++) if (r[i].error) { done(r[i].error.message); return; }
      var prof = r[0].data, allCourses = r[1].data, enrolls = r[2].data,
          comps = r[3].data, asgs = r[4].data, subs = r[5].data,
          sess = r[6].data, att = r[7].data, certs = r[8].data;

      TODAY = new Date();
      var doneLessons = {};
      comps.forEach(function (c) { doneLessons[c.lesson_id] = true; });
      var enrolledIds = {};
      enrolls.forEach(function (e) { if (e.student_id === user.id) enrolledIds[e.course_id] = e; });

      courses = allCourses.map(function (c) {
        var total = 0, doneN = 0;
        var modules = (c.modules || []).sort(function (a, b) { return a.position - b.position; }).map(function (m) {
          return { title: m.title, lessons: (m.lessons || []).sort(function (a, b) { return a.position - b.position; }).map(function (l) {
            total++; if (doneLessons[l.id]) doneN++;
            return { title: l.title, type: l.type === "video" ? "video" : "reading", length: l.duration || "", done: !!doneLessons[l.id] };
          }) };
        });
        var enr = enrolledIds[c.id];
        var progress = total ? Math.round((doneN / total) * 100) : 0;
        return {
          id: c.id, title: c.title, icon: c.icon || "📚",
          instructor: c.instructor ? "Eng. " + c.instructor.first_name : "CORE Egypt",
          progress: enr ? progress : 0,
          status: !enr ? "not-started" : (progress >= 100 ? "completed" : "in-progress"),
          enrolled: !!enr,
          enrolledOn: enr ? monthYear(enr.enrolled_at) : "",
          description: c.description || "", outcomes: [], tags: c.tags || [], modules: modules,
        };
      });

      var enrolledCourseIds = courses.filter(function (c) { return c.enrolled; }).map(function (c) { return c.id; });
      var subByAsg = {};
      subs.forEach(function (s) { subByAsg[s.assignment_id] = s; });
      assignments = asgs.filter(function (a) { return enrolledCourseIds.indexOf(a.course_id) !== -1; }).map(function (a) {
        var s = subByAsg[a.id];
        return { id: a.id, title: a.title, courseId: a.course_id, dueDate: a.due_date || ymd(new Date()),
          status: !s ? "pending" : (s.status === "graded" ? "graded" : "submitted"),
          grade: s && s.status === "graded" ? gradeLetter((s.score / a.max_points) * 100) : null };
      });

      liveSessions = sess.filter(function (s) { return enrolledCourseIds.indexOf(s.course_id) !== -1; }).map(function (s) {
        var start = new Date(s.starts_at), now = new Date();
        var past = (start.getTime() + (s.duration_min || 60) * 60000) < now.getTime();
        var joinable = !past && (start - now) < 15 * 60000;
        var course = courses.find(function (c) { return c.id === s.course_id; });
        return { id: s.id, title: s.title, courseId: s.course_id,
          instructor: course ? course.instructor : "", when: fmtWhen(s.starts_at),
          joinable: joinable, countdown: countdownText(s.starts_at), past: past,
          platform: s.platform, meetingUrl: s.meeting_url,
          duration: (s.duration_min || 60) + " min" };
      });

      attendanceRecords = att.filter(function (a) { return a.session; }).map(function (a) {
        return { date: ymd(a.session.starts_at), courseId: a.session.course_id,
          status: a.status === "late" ? "present" : a.status };
      });
      var totalAtt = att.length, presentAtt = att.filter(function (a) { return a.status !== "absent"; }).length;
      overallAttendance = totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 100;

      grades = [];
      var allPcts = [];
      enrolledCourseIds.forEach(function (cid) {
        var g = subs.filter(function (s) { return s.status === "graded"; }).map(function (s) {
          var a = asgs.find(function (x) { return x.id === s.assignment_id; });
          return a && a.course_id === cid ? (s.score / a.max_points) * 100 : null;
        }).filter(function (x) { return x != null; });
        if (!g.length) { grades.push({ courseId: cid, assignmentsAvg: "—", labsAvg: "—", finalGrade: "—", overallGrade: "—" }); return; }
        var avg = g.reduce(function (a, b) { return a + b; }, 0) / g.length;
        allPcts.push(avg);
        grades.push({ courseId: cid, assignmentsAvg: gradeLetter(avg), labsAvg: "—", finalGrade: "—", overallGrade: gradeLetter(avg) });
      });
      overallGrade = allPcts.length ? gradeLetter(allPcts.reduce(function (a, b) { return a + b; }, 0) / allPcts.length) : "—";

      certificates = [];
      certs.forEach(function (c) {
        certificates.push({ id: c.id, courseId: c.course_id, earned: true, dateEarned: monthYear(c.issued_at), verificationCode: c.verification_code });
      });
      enrolledCourseIds.forEach(function (cid) {
        if (!certs.some(function (c) { return c.course_id === cid; }))
          certificates.push({ id: "lock-" + cid, courseId: cid, earned: false, dateEarned: null, verificationCode: null });
      });

      recentActivity = [];
      certs.slice(0, 2).forEach(function (c) {
        var course = courses.find(function (x) { return x.id === c.course_id; });
        recentActivity.push({ icon: "🎓", text: "Earned the <strong>" + esc(course ? course.title : "course") + "</strong> certificate", time: monthYear(c.issued_at), cert: true, link: "certificates.html" });
      });
      subs.slice(0, 3).forEach(function (s) {
        var a = asgs.find(function (x) { return x.id === s.assignment_id; });
        recentActivity.push({ icon: "📝", text: "Submitted <strong>" + esc(a ? a.title : "assignment") + "</strong>", time: monthYear(s.submitted_at), link: "assignments.html" });
      });
      if (!recentActivity.length) recentActivity.push({ icon: "👋", text: "Welcome to CORE Egypt — your activity will appear here", time: "now", link: "courses.html" });

      var firstEnrolled = courses.find(function (c) { return c.enrolled; });
      currentStudent = {
        name: prof.first_name, id: prof.code || "—", email: user.email,
        phone: prof.phone || "", dob: prof.dob || "", address: prof.address || "",
        program: firstEnrolled ? firstEnrolled.title : "Not enrolled yet",
        avatarInitials: prof.avatar_initials || prof.first_name.charAt(0).toUpperCase(),
        joinDate: monthYear(prof.created_at),
        dayOfJourney: Math.max(1, Math.round((new Date() - new Date(prof.created_at)) / 86400000)),
      };
      done(null);
    }).catch(function (e) { done(String(e)); });
  });
}

/* ---------- TEACHER LOADER ---------- */
function dbLoadTeacherData(done) {
  sb.auth.getUser().then(function (u) {
    var user = u.data.user;
    if (!user) { portalLogout(); return; }
    Promise.all([
      sb.from("profiles").select("*").eq("id", user.id).single(),
      sb.from("courses").select("*, modules(*, lessons(*))").eq("instructor_id", user.id).order("title"),
      sb.from("enrollments").select("*, student:profiles(first_name, code, avatar_initials)"),
      sb.from("submissions").select("*, student:profiles(first_name, code), assignment:assignments(title, course_id, max_points)"),
      sb.from("live_sessions").select("*"),
      sb.from("attendance").select("*"),
      sb.from("lesson_completions").select("*"),
    ]).then(function (r) {
      for (var i = 0; i < r.length; i++) if (r[i].error) { done(r[i].error.message); return; }
      var prof = r[0].data, myCourses = r[1].data, enrolls = r[2].data,
          subs = r[3].data, sess = r[4].data, att = r[5].data, comps = r[6].data;

      TODAY = new Date();
      var myCourseIds = myCourses.map(function (c) { return c.id; });
      var lessonToCourse = {}, lessonCount = {};
      myCourses.forEach(function (c) {
        lessonCount[c.id] = 0;
        (c.modules || []).forEach(function (m) { (m.lessons || []).forEach(function (l) { lessonToCourse[l.id] = c.id; lessonCount[c.id]++; }); });
      });
      var myEnrolls = enrolls.filter(function (e) { return myCourseIds.indexOf(e.course_id) !== -1; });
      var mySubs = subs.filter(function (s) { return s.assignment && myCourseIds.indexOf(s.assignment.course_id) !== -1; });

      teacherCourses = myCourses.map(function (c) {
        var enrolledCount = myEnrolls.filter(function (e) { return e.course_id === c.id; }).length;
        var courseComps = comps.filter(function (x) { return lessonToCourse[x.lesson_id] === c.id; }).length;
        var avgProgress = enrolledCount && lessonCount[c.id] ? Math.round((courseComps / (enrolledCount * lessonCount[c.id])) * 100) : 0;
        var graded = mySubs.filter(function (s) { return s.assignment.course_id === c.id && s.status === "graded"; });
        var avgPct = graded.length ? graded.reduce(function (a, s) { return a + (s.score / s.assignment.max_points) * 100; }, 0) / graded.length : null;
        var courseSessIds = sess.filter(function (s) { return s.course_id === c.id; }).map(function (s) { return s.id; });
        var courseAtt = att.filter(function (a) { return courseSessIds.indexOf(a.session_id) !== -1; });
        var attPct = courseAtt.length ? Math.round((courseAtt.filter(function (a) { return a.status !== "absent"; }).length / courseAtt.length) * 100) : 100;
        return { id: c.id, title: c.title, icon: c.icon || "📚", programType: "", status: c.status,
          enrolledCount: enrolledCount, avgProgress: avgProgress,
          avgGrade: avgPct == null ? "—" : gradeLetter(avgPct), avgGradePct: avgPct == null ? 0 : Math.round(avgPct),
          avgAttendance: attPct };
      });

      var byStudent = {};
      myEnrolls.forEach(function (e) {
        if (!e.student) return;
        var k = e.student_id;
        if (!byStudent[k]) byStudent[k] = { uid: k, id: e.student.code || k.slice(0, 8), name: e.student.first_name,
          avatarInitials: e.student.avatar_initials || e.student.first_name.charAt(0).toUpperCase(), courseIds: [] };
        byStudent[k].courseIds.push(e.course_id);
      });
      teacherStudents = Object.keys(byStudent).map(function (k) {
        var s = byStudent[k];
        var sComps = comps.filter(function (c) { return c.student_id === k && lessonToCourse[c.lesson_id]; }).length;
        var totalLessons = s.courseIds.reduce(function (a, cid) { return a + (lessonCount[cid] || 0); }, 0);
        s.progress = totalLessons ? Math.round((sComps / totalLessons) * 100) : 0;
        var sGraded = mySubs.filter(function (x) { return x.student_id === k && x.status === "graded"; });
        var sPct = sGraded.length ? sGraded.reduce(function (a, x) { return a + (x.score / x.assignment.max_points) * 100; }, 0) / sGraded.length : null;
        s.grade = sPct == null ? "—" : gradeLetter(sPct);
        var sAtt = att.filter(function (a) { return a.student_id === k; });
        s.attendanceRate = sAtt.length ? Math.round((sAtt.filter(function (a) { return a.status !== "absent"; }).length / sAtt.length) * 100) : 100;
        return s;
      });
      var codeOf = {};
      Object.keys(byStudent).forEach(function (k) { codeOf[k] = byStudent[k].id; });

      submissions = mySubs.map(function (s) {
        return { id: s.id, studentId: codeOf[s.student_id] || (s.student && s.student.code) || "—",
          assignmentTitle: s.assignment.title, courseId: s.assignment.course_id,
          submittedDate: ymd(s.submitted_at), status: s.status === "graded" ? "graded" : "ungraded",
          score: s.score, maxPoints: s.assignment.max_points, notes: s.notes || "" };
      });

      teacherSessions = sess.filter(function (s) { return myCourseIds.indexOf(s.course_id) !== -1; }).map(function (s) {
        var start = new Date(s.starts_at), now = new Date();
        var past = (start.getTime() + (s.duration_min || 60) * 60000) < now.getTime();
        var enrolledCount = myEnrolls.filter(function (e) { return e.course_id === s.course_id; }).length;
        var attended = att.filter(function (a) { return a.session_id === s.id && a.status !== "absent"; }).length;
        return { id: s.id, title: s.title, courseId: s.course_id, when: fmtWhen(s.starts_at), time: fmtTime(s.starts_at),
          today: isSameDay(start, now), status: past ? "past" : "upcoming",
          enrolledCount: enrolledCount, attendedCount: past ? attended : null,
          platform: s.platform, meetingUrl: s.meeting_url };
      });

      var dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      var gradedAll = mySubs.filter(function (s) { return s.status === "graded"; });
      gradedAll.forEach(function (s) {
        var L = gradeLetter((s.score / s.assignment.max_points) * 100).charAt(0);
        if (dist[L] != null) dist[L]++;
      });
      var avgAll = gradedAll.length ? gradedAll.reduce(function (a, s) { return a + (s.score / s.assignment.max_points) * 100; }, 0) / gradedAll.length : null;
      var pastSess = teacherSessions.filter(function (s) { return s.status === "past"; }).slice(-7);
      var trend = pastSess.map(function (s) {
        var rows = att.filter(function (a) { return a.session_id === s.id; });
        return rows.length ? Math.round((rows.filter(function (a) { return a.status !== "absent"; }).length / rows.length) * 100) : 100;
      });
      if (trend.length < 2) trend = [100, 100];
      var totalEnrolled = myEnrolls.length || 1;
      reportMetrics = {
        avgGrade: avgAll == null ? "—" : gradeLetter(avgAll),
        completionRate: teacherCourses.length ? Math.round(teacherCourses.reduce(function (a, c) { return a + c.avgProgress; }, 0) / teacherCourses.length) : 0,
        avgAttendance: att.length ? Math.round((att.filter(function (a) { return a.status !== "absent"; }).length / att.length) * 100) : 100,
        submissionRate: Math.min(100, Math.round((mySubs.length / totalEnrolled) * 100)),
        gradeDistribution: dist,
        attendanceTrend: trend,
        assignmentCompletion: [],
      };

      currentInstructor = {
        name: "Eng. " + prof.first_name, uid: user.id, id: prof.code || "—", email: user.email,
        phone: prof.phone || "", disciplines: prof.disciplines || [],
        avatarInitials: prof.avatar_initials || prof.first_name.charAt(0).toUpperCase(),
        teachingSince: monthYear(prof.created_at),
        isAdmin: prof.role === "admin",
        bio: prof.bio || "",
      };
      done(null);
    }).catch(function (e) { done(String(e)); });
  });
}

/* ---------- WRITES ---------- */
function dbSubmitAssignment(assignmentId, notes, done) {
  sb.auth.getUser().then(function (u) {
    sb.from("submissions").insert({ assignment_id: assignmentId, student_id: u.data.user.id, notes: notes })
      .then(function (r) { done(r.error && r.error.message); });
  });
}
function dbGradeSubmission(submissionId, score, feedback, done) {
  sb.from("submissions").update({ score: score, feedback: feedback, status: "graded" }).eq("id", submissionId)
    .then(function (r) { done(r.error && r.error.message); });
}
function dbCreateSession(row, done) {
  sb.from("live_sessions").insert(row).then(function (r) { done(r.error && r.error.message); });
}
function dbCancelSession(id, done) {
  sb.from("live_sessions").delete().eq("id", id).then(function (r) { done(r.error && r.error.message); });
}
function dbSaveAttendance(sessionId, rows, done) {
  var payload = rows.map(function (x) { return { session_id: sessionId, student_id: x.student_id, status: x.status }; });
  sb.from("attendance").upsert(payload, { onConflict: "session_id,student_id" })
    .then(function (r) { done(r.error && r.error.message); });
}
function dbUpdateProfile(fields, done) {
  sb.auth.getUser().then(function (u) {
    sb.from("profiles").update(fields).eq("id", u.data.user.id)
      .then(function (r) { done(r.error && r.error.message); });
  });
}
function dbCreateCourse(course, modulesArr, assignmentsArr, done) {
  sb.auth.getUser().then(function (u) {
    course.instructor_id = u.data.user.id;
    sb.from("courses").insert(course).select().single().then(function (r) {
      if (r.error) { done(r.error.message); return; }
      var courseId = r.data.id;
      var work = [];
      modulesArr.forEach(function (m, i) {
        work.push(sb.from("modules").insert({ course_id: courseId, title: m.title, position: i + 1 }).select().single()
          .then(function (mr) {
            if (mr.error || !m.lessons.length) return mr;
            return sb.from("lessons").insert(m.lessons.map(function (l, j) {
              return { module_id: mr.data.id, title: l.title, type: l.type, duration: l.duration, position: j + 1 };
            }));
          }));
      });
      if (assignmentsArr.length) work.push(sb.from("assignments").insert(assignmentsArr.map(function (a) {
        return { course_id: courseId, title: a.title, due_date: a.due_date || null, max_points: a.max_points || 100 };
      })));
      Promise.all(work).then(function () { done(null, courseId); }).catch(function (e) { done(String(e)); });
    });
  });
}

/* =========================================================
   TEACHER APPROVAL (admin only)
   ========================================================= */

function dbPendingTeachers(done) {
  sb.from("profiles").select("id, first_name, code, created_at")
    .eq("role", "pending_teacher").order("created_at")
    .then(function (r) { done(r.error && r.error.message, r.data || []); });
}

/* approve=true -> teacher, approve=false -> demoted to student.
   The RPC itself re-checks that the caller is an admin. */
function dbReviewTeacher(userId, approve, done) {
  sb.rpc("approve_teacher", { target: userId, approve: approve })
    .then(function (r) { done(r.error && r.error.message); });
}

/* =========================================================
   COURSE EDITING — load one course, then diff-sync on save
   ========================================================= */

function dbLoadCourseForEdit(courseId, done) {
  Promise.all([
    sb.from("courses").select("*, modules(*, lessons(*))").eq("id", courseId).single(),
    sb.from("assignments").select("*").eq("course_id", courseId),
  ]).then(function (r) {
    if (r[0].error) { done(r[0].error.message); return; }
    if (r[1].error) { done(r[1].error.message); return; }
    var c = r[0].data;
    c.modules = (c.modules || []).sort(function (a, b) { return a.position - b.position; });
    c.modules.forEach(function (m) {
      m.lessons = (m.lessons || []).sort(function (a, b) { return a.position - b.position; });
    });
    c.assignmentsList = r[1].data || [];
    done(null, c);
  }).catch(function (e) { done(String(e)); });
}

/* Sync the edited course to the database.
   modulesArr:     [{ id?, title, lessons: [{ id?, title, type, duration }] }]
   assignmentsArr: [{ id?, title, due_date, max_points }]
   Rows present in the database but missing from these arrays are DELETED
   (cascading to lesson_completions / submissions) — the page warns first. */
function dbUpdateCourse(courseId, course, modulesArr, assignmentsArr, done) {
  var chain = sb.from("courses").update(course).eq("id", courseId).then(function (r) {
    if (r.error) throw new Error(r.error.message);
    return Promise.all([
      sb.from("modules").select("id").eq("course_id", courseId),
      sb.from("assignments").select("id").eq("course_id", courseId),
    ]);
  });

  chain.then(function (res) {
    if (res[0].error) throw new Error(res[0].error.message);
    if (res[1].error) throw new Error(res[1].error.message);
    var existingModuleIds = res[0].data.map(function (m) { return m.id; });
    var existingAsgIds = res[1].data.map(function (a) { return a.id; });
    var keptModuleIds = modulesArr.filter(function (m) { return m.id; }).map(function (m) { return m.id; });
    var keptAsgIds = assignmentsArr.filter(function (a) { return a.id; }).map(function (a) { return a.id; });
    var removedModules = existingModuleIds.filter(function (id) { return keptModuleIds.indexOf(id) === -1; });
    var removedAsgs = existingAsgIds.filter(function (id) { return keptAsgIds.indexOf(id) === -1; });

    var work = [];
    if (removedModules.length) work.push(sb.from("modules").delete().in("id", removedModules));
    if (removedAsgs.length) work.push(sb.from("assignments").delete().in("id", removedAsgs));

    /* modules: update kept, insert new, then sync each module's lessons */
    modulesArr.forEach(function (m, i) {
      if (m.id) {
        work.push(
          sb.from("modules").update({ title: m.title, position: i + 1 }).eq("id", m.id)
            .then(function () { return syncLessons(m.id, m.lessons); })
        );
      } else {
        work.push(
          sb.from("modules").insert({ course_id: courseId, title: m.title, position: i + 1 }).select().single()
            .then(function (mr) {
              if (mr.error) throw new Error(mr.error.message);
              return insertLessons(mr.data.id, m.lessons);
            })
        );
      }
    });

    /* assignments: update kept, insert new */
    assignmentsArr.forEach(function (a) {
      var row = { title: a.title, due_date: a.due_date || null, max_points: a.max_points || 100 };
      if (a.id) work.push(sb.from("assignments").update(row).eq("id", a.id));
      else { row.course_id = courseId; work.push(sb.from("assignments").insert(row)); }
    });

    return Promise.all(work);
  }).then(function () { done(null); })
    .catch(function (e) { done(e.message || String(e)); });

  function insertLessons(moduleId, lessons) {
    if (!lessons.length) return Promise.resolve();
    return sb.from("lessons").insert(lessons.map(function (l, j) {
      return { module_id: moduleId, title: l.title, type: l.type, duration: l.duration, position: j + 1 };
    }));
  }

  function syncLessons(moduleId, lessons) {
    return sb.from("lessons").select("id").eq("module_id", moduleId).then(function (lr) {
      if (lr.error) throw new Error(lr.error.message);
      var existing = lr.data.map(function (l) { return l.id; });
      var kept = lessons.filter(function (l) { return l.id; }).map(function (l) { return l.id; });
      var removed = existing.filter(function (id) { return kept.indexOf(id) === -1; });
      var jobs = [];
      if (removed.length) jobs.push(sb.from("lessons").delete().in("id", removed));
      var fresh = [];
      lessons.forEach(function (l, j) {
        var row = { title: l.title, type: l.type, duration: l.duration, position: j + 1 };
        if (l.id) jobs.push(sb.from("lessons").update(row).eq("id", l.id));
        else { row.module_id = moduleId; fresh.push(row); }
      });
      if (fresh.length) jobs.push(sb.from("lessons").insert(fresh));
      return Promise.all(jobs);
    });
  }
}
