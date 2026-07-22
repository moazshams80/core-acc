/* =========================================================
   CORE Egypt — BILINGUAL ENGINE (English / العربية)

   How it works:
   - t("English string") returns the Arabic translation when the
     language is Arabic and a translation exists, otherwise the
     English text unchanged. So untranslated strings degrade
     gracefully to English — new translations can be added in waves.
   - Static text carries data-i18n="English"; applyI18n() swaps it.
   - The language choice is saved and the page reloads on switch, so
     every dynamically-rendered string re-runs through t().
   - Sets <html dir> to rtl for Arabic (the CSS already supports RTL).
   ========================================================= */

var LANG = "en";
try { LANG = localStorage.getItem("coreLang") === "ar" ? "ar" : "en"; } catch (e) {}

/* Apply direction/lang as early as possible (before content paints) */
document.documentElement.setAttribute("lang", LANG);
document.documentElement.setAttribute("dir", LANG === "ar" ? "rtl" : "ltr");

var AR = {
  /* ---- navigation ---- */
  "Dashboard": "لوحة التحكم",
  "Courses": "الدورات",
  "My Courses": "دوراتي",
  "Assignments": "الواجبات",
  "Live Sessions": "الجلسات المباشرة",
  "Attendance": "الحضور",
  "Grades": "الدرجات",
  "Certificates": "الشهادات",
  "Profile": "الملف الشخصي",
  "Students": "الطلاب",
  "Grading": "التصحيح",
  "Reports": "التقارير",
  "Approvals": "الموافقات",
  "Course": "الدورة",
  "Course Builder": "منشئ الدورات",
  "Instructor Approvals": "موافقات المدرّبين",

  /* ---- header / user menu ---- */
  "Settings": "الإعدادات",
  "Log Out": "تسجيل الخروج",
  "Notifications": "الإشعارات",
  "Instructor": "مدرّب",

  /* ---- buttons / actions ---- */
  "Log In": "تسجيل الدخول",
  "Create an account": "إنشاء حساب",
  "Create Account": "إنشاء الحساب",
  "Send reset link": "إرسال رابط إعادة التعيين",
  "Update password": "تحديث كلمة المرور",
  "Update Password": "تحديث كلمة المرور",
  "Save Changes": "حفظ التغييرات",
  "Submit": "إرسال",
  "Submit Assignment": "إرسال الواجب",
  "Enroll": "التسجيل",
  "Continue": "متابعة",
  "Start": "ابدأ",
  "Review": "مراجعة",
  "Manage": "إدارة",
  "Edit": "تعديل",
  "View Students": "عرض الطلاب",
  "View Profile": "عرض الملف",
  "Join Session": "الانضمام للجلسة",
  "Start Session": "بدء الجلسة",
  "Cancel": "إلغاء",
  "Schedule Session": "جدولة جلسة",
  "Mark All Present": "تعليم الجميع حاضرين",
  "Save Attendance": "حفظ الحضور",
  "Download": "تنزيل",
  "Open": "فتح",
  "Remove": "إزالة",
  "Upload": "رفع",
  "Verify": "تحقّق",
  "View Certificate": "عرض الشهادة",
  "View Verification": "عرض التحقّق",
  "Issue Certificate": "إصدار شهادة",
  "Approve": "موافقة",
  "Reject": "رفض",
  "Send Request": "إرسال الطلب",
  "Resume": "استئناف",
  "View all": "عرض الكل",
  "Save Course": "حفظ الدورة",
  "Save Grade": "حفظ الدرجة",
  "Update": "تحديث",
  "Log in": "تسجيل الدخول",
  "Teacher login": "دخول المدرّب",
  "Student login": "دخول الطالب",
  "Back to sign in": "العودة لتسجيل الدخول",
  "Request a new link": "طلب رابط جديد",
  "+ Create New Course": "+ إنشاء دورة جديدة",
  "+ Add Module": "+ إضافة وحدة",
  "+ Add Assignment": "+ إضافة واجب",
  "+ Add lesson": "+ إضافة درس",
  "+ Schedule Session": "+ جدولة جلسة",
  "Get link ↗": "احصل على الرابط ↗",

  /* ---- auth pages ---- */
  "Student Portal": "بوابة الطالب",
  "Instructor Portal": "بوابة المدرّب",
  "Student Login": "دخول الطالب",
  "Teacher Login": "دخول المدرّب",
  "Sign in": "تسجيل الدخول",
  "Sign in with your CORE Egypt account.": "سجّل الدخول بحساب CORE Egypt الخاص بك.",
  "Student ID or Email": "رقم الطالب أو البريد الإلكتروني",
  "Instructor ID or Email": "رقم المدرّب أو البريد الإلكتروني",
  "Email or Student ID": "البريد الإلكتروني أو رقم الطالب",
  "Email or Instructor ID": "البريد الإلكتروني أو رقم المدرّب",
  "Password": "كلمة المرور",
  "New password": "كلمة المرور الجديدة",
  "Confirm new password": "تأكيد كلمة المرور الجديدة",
  "Confirm password": "تأكيد كلمة المرور",
  "Full name": "الاسم الكامل",
  "Email address": "البريد الإلكتروني",
  "Remember me": "تذكّرني",
  "Forgot password?": "نسيت كلمة المرور؟",
  "How would you like to sign in?": "كيف تريد تسجيل الدخول؟",
  "Choose your account type to continue.": "اختر نوع حسابك للمتابعة.",
  "I'm a Student": "أنا طالب",
  "I'm a Teacher": "أنا مدرّب",
  "Access your courses, assignments & certificates.": "الوصول إلى دوراتك وواجباتك وشهاداتك.",
  "Manage courses, grading, sessions & reports.": "إدارة الدورات والتصحيح والجلسات والتقارير.",
  "New here?": "مستخدم جديد؟",
  "New student?": "طالب جديد؟",
  "New instructor?": "مدرّب جديد؟",
  "Are you an instructor?": "هل أنت مدرّب؟",
  "Are you a student?": "هل أنت طالب؟",
  "Create your CORE Egypt account.": "أنشئ حسابك في CORE Egypt.",
  "At least 8 characters": "8 أحرف على الأقل",
  "Re-enter password": "أعد إدخال كلمة المرور",
  "Re-enter new password": "أعد إدخال كلمة المرور الجديدة",
  "I agree to the Terms & Privacy Policy": "أوافق على الشروط وسياسة الخصوصية",
  "or": "أو",
  "Forgot your password?": "نسيت كلمة المرور؟",
  "Set a new password": "تعيين كلمة مرور جديدة",
  "Send us your email and we'll send a link to reset it.": "أرسل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة التعيين.",

  /* ---- status badges ---- */
  "In Progress": "قيد التقدّم",
  "Completed": "مكتملة",
  "Not Started": "لم تبدأ",
  "Pending": "قيد الانتظار",
  "Submitted": "تم الإرسال",
  "Graded": "تم التصحيح",
  "Present": "حاضر",
  "Absent": "غائب",
  "Late": "متأخر",
  "Published": "منشورة",
  "Draft": "مسودة",
  "Active": "نشط",
  "Coming Soon": "قريبًا",
  "Protected": "محمي",

  /* ---- common labels / table headers ---- */
  "Overall Grade": "المعدّل العام",
  "Progress": "التقدّم",
  "Student": "الطالب",
  "Date": "التاريخ",
  "Status": "الحالة",
  "Grade": "الدرجة",
  "Due": "الاستحقاق",
  "Session": "الجلسة",
  "Summary": "الملخّص",
  "Verification code": "رمز التحقّق",
  "Issued": "تاريخ الإصدار",
  "Attendance Rate": "نسبة الحضور",
  "Overall": "الإجمالي",
  "Assignment": "الواجب",
  "Name": "الاسم",
  "Requested": "تاريخ الطلب",
  "Decision": "القرار",
  "Instructor ID": "رقم المدرّب",
  "Grade / Action": "الدرجة / الإجراء",
  "Completion": "الإنجاز",
  "All": "الكل",
  "All courses": "كل الدورات",

  /* ---- dashboards ---- */
  "Active Courses": "الدورات النشطة",
  "Total Students": "إجمالي الطلاب",
  "Pending Grading": "بانتظار التصحيح",
  "Upcoming Sessions": "الجلسات القادمة",
  "Courses in Progress": "الدورات الجارية",
  "Assignments Due": "واجبات مستحقة",
  "Continue Learning": "متابعة التعلّم",
  "Upcoming": "القادم",
  "Recent Activity": "النشاط الأخير",
  "Needs Your Attention": "يتطلّب انتباهك",
  "Today's Schedule": "جدول اليوم",
  "Course Performance Snapshot": "لمحة عن أداء الدورات",
  "Grade now": "صحّح الآن",
  "View": "عرض",

  /* ---- empty states ---- */
  "Nothing here": "لا يوجد شيء هنا",
  "No courses yet": "لا توجد دورات بعد",
  "No students found": "لا يوجد طلاب",
  "No students enrolled": "لا يوجد طلاب مسجّلين",
  "No sessions today": "لا جلسات اليوم",
  "All caught up": "كل شيء مُنجز",
  "No certificates yet": "لا توجد شهادات بعد",
  "No materials yet": "لا توجد مواد بعد",
  "Nothing to review": "لا شيء للمراجعة",
  "Admins only": "للمشرفين فقط",

  /* ---- misc UI ---- */
  "Your Certificates": "شهاداتك",
  "Course Materials": "مواد الدورة",
  "Overview": "نظرة عامة",
  "Modules": "الوحدات",
  "Materials": "المواد",
  "Discussion": "النقاش",
  "Learning Outcomes": "مخرجات التعلّم",
  "Session Log": "سجلّ الجلسات",
  "Recent Sessions": "الجلسات الأخيرة",
  "Upcoming Sessions": "الجلسات القادمة",
  "Past Sessions": "الجلسات السابقة",
  "Personal Info": "البيانات الشخصية",
  "Security": "الأمان",
  "Current Password": "كلمة المرور الحالية",
  "New Password": "كلمة المرور الجديدة",
  "Confirm New Password": "تأكيد كلمة المرور الجديدة",
  "Downloads require admin access": "التنزيل يتطلب صلاحية المشرف",
  "Menu": "القائمة",
  "Welcome back": "مرحبًا بعودتك",
  "English": "English",
  "العربية": "العربية",
};

function t(s) {
  if (s == null) return s;
  return (LANG === "ar" && AR[s]) ? AR[s] : s;
}

/* Translate static markup: data-i18n (text) and data-i18n-ph (placeholder) */
function applyI18n(root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
}

/* Language toggle button (globe + the OTHER language's name) */
function langToggleHTML() {
  var other = LANG === "ar" ? "English" : "العربية";
  return '<button class="lang-toggle icon-btn" data-lang-toggle title="' + other + '" aria-label="' + other + '">' +
    (typeof ICON === "function" ? ICON("globe", 18) : "🌐") + '<span class="lang-label">' + other + "</span></button>";
}

function toggleLang() {
  var next = LANG === "ar" ? "en" : "ar";
  try { localStorage.setItem("coreLang", next); } catch (e) {}
  window.location.reload();
}

document.addEventListener("click", function (e) {
  if (e.target.closest("[data-lang-toggle]")) { e.preventDefault(); toggleLang(); }
});

document.addEventListener("DOMContentLoaded", function () {
  applyI18n();
  /* Pages without the portal header (login, register, verify…) get a
     floating toggle so the language can always be switched. */
  if (!document.querySelector("[data-lang-toggle]")) {
    var b = document.createElement("div");
    b.className = "lang-toggle-floating";
    b.innerHTML = langToggleHTML();
    document.body.appendChild(b);
  }
});
