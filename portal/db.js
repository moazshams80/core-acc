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

var SUPABASE_URL = "";       // e.g. "https://abcdefgh.supabase.co"
var SUPABASE_ANON_KEY = "";  // the long "anon / public" key

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
