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

  /* ---- dashboards / cards ---- */
  "Live Session": "جلسة مباشرة",
  "Not published yet": "لم تُنشر بعد",
  "Enjoy the breather.": "استمتع بالاستراحة.",
  "Across all active courses": "عبر جميع الدورات النشطة",
  "Grade Distribution": "توزيع الدرجات",
  "Overall grade per course": "المعدّل العام لكل دورة",
  "Course Breakdown": "تفصيل الدورات",
  "Click a course to see individual assignment grades.": "اضغط على دورة لعرض درجات الواجبات.",
  "Assignment grades": "درجات الواجبات",
  "No graded assignments yet.": "لا توجد واجبات مُصحّحة بعد.",
  "Labs": "المعامل",
  "Final": "النهائي",

  /* ---- assignments ---- */
  "View brief": "عرض الوصف",
  "Assignment Brief": "وصف الواجب",
  "Awaiting grade": "بانتظار الدرجة",
  "No assignments match this filter.": "لا توجد واجبات مطابقة لهذه التصفية.",
  "Notes for your instructor": "ملاحظات لمدرّبك",
  "Attach your work": "أرفق عملك",
  "Submit Assignment": "إرسال الواجب",
  "Grade / Action": "الدرجة / الإجراء",

  /* ---- live sessions ---- */
  "Host and manage your sessions.": "استضف جلساتك وأدرها.",
  "Watch Recording": "مشاهدة التسجيل",
  "Upload Recording": "رفع التسجيل",
  "Session title": "عنوان الجلسة",
  "Date & time": "التاريخ والوقت",
  "Duration (minutes)": "المدة (بالدقائق)",
  "Meeting platform": "منصة الاجتماع",
  "Meeting link": "رابط الاجتماع",

  /* ---- attendance ---- */
  "Overall Attendance": "الحضور العام",
  "Class Session": "حصة دراسية",

  /* ---- grading ---- */
  "To Grade": "للتصحيح",
  "Grade Submission": "تصحيح التسليم",
  "Letter grade (auto)": "الدرجة الحرفية (تلقائي)",
  "Feedback": "ملاحظات",
  "Save Grade": "حفظ الدرجة",
  "Open attached file": "فتح الملف المرفق",
  "All caught up": "تم إنجاز كل شيء",
  "No submissions match this view.": "لا توجد تسليمات مطابقة لهذا العرض.",
  "Ungraded": "غير مُصحّح",

  /* ---- students ---- */
  "View Profile": "عرض الملف",
  "Recent Submissions": "التسليمات الأخيرة",
  "No submissions yet.": "لا توجد تسليمات بعد.",
  "Try a different search or filter.": "جرّب بحثًا أو تصفية مختلفة.",

  /* ---- reports ---- */
  "Avg Class Grade": "متوسط درجة الصف",
  "Completion Rate": "نسبة الإنجاز",
  "Avg Attendance": "متوسط الحضور",
  "Submission Rate": "نسبة التسليم",
  "Attendance Trend": "اتجاه الحضور",
  "Assignment Completion Rate": "نسبة إنجاز الواجبات",
  "Top Performers": "الأعلى أداءً",
  "At-Risk Students": "الطلاب المعرّضون للخطر",
  "Per-Student Summary": "ملخّص لكل طالب",
  "Export CSV": "تصدير CSV",
  "None yet.": "لا شيء بعد.",
  "No at-risk students.": "لا يوجد طلاب معرّضون للخطر.",

  /* ---- certificates (teacher) ---- */
  "Issue Certificates": "إصدار الشهادات",
  "Issue a certificate": "إصدار شهادة",
  "Certificate file (PDF or image)": "ملف الشهادة (PDF أو صورة)",
  "Issued for this course": "الصادرة لهذه الدورة",
  "None issued yet": "لم يُصدر أي شيء بعد",
  "Certificate of Completion": "شهادة إتمام",
  "Complete course to unlock": "أكمل الدورة لإلغاء القفل",

  /* ---- course builder ---- */
  "Create New Course": "إنشاء دورة جديدة",
  "Edit Course": "تعديل الدورة",
  "Course Info": "معلومات الدورة",
  "Course title": "عنوان الدورة",
  "Discipline": "التخصص",
  "Description": "الوصف",
  "Course icon": "أيقونة الدورة",
  "Module title": "عنوان الوحدة",
  "Remove module": "إزالة الوحدة",
  "Lesson title": "عنوان الدرس",
  "Duration": "المدة",
  "Back to courses": "العودة إلى الدورات",

  /* ---- approvals ---- */
  "Back to dashboard": "العودة إلى لوحة التحكم",

  /* ---- profile ---- */
  "Phone": "الهاتف",
  "Date of Birth": "تاريخ الميلاد",
  "Address": "العنوان",
  "Bio": "نبذة",
  "Member since": "عضو منذ",
  "Teaching since": "يُدرّس منذ",
  "Disciplines": "التخصصات",
  "Email notifications": "إشعارات البريد الإلكتروني",
  "Assignment reminders": "تذكيرات الواجبات",
  "Live session reminders": "تذكيرات الجلسات المباشرة",
  "Certificate updates": "تحديثات الشهادات",
  "Grading reminders": "تذكيرات التصحيح",
  "Session reminders": "تذكيرات الجلسات",
  "New submission alerts": "تنبيهات التسليمات الجديدة",
  "Student messages": "رسائل الطلاب",
  "Edit avatar": "تعديل الصورة",

  /* ---- notifications (header dropdown) ---- */
  "<strong>CCTV Coverage Plan</strong> is due tomorrow": "<strong>خطة تغطية الكاميرات</strong> مستحقة غدًا",
  "<strong>Live Q&amp;A: NFPA Standards</strong> starts in 15 min": "<strong>أسئلة وأجوبة مباشرة: معايير NFPA</strong> تبدأ خلال 15 دقيقة",
  "Your <strong>Data Center</strong> certificate is ready": "شهادة <strong>مراكز البيانات</strong> جاهزة",
  "<strong>7 submissions</strong> awaiting your grading": "<strong>7 تسليمات</strong> بانتظار تصحيحك",
  "<strong>CCTV Network Integration</strong> session starts soon": "جلسة <strong>دمج شبكات الكاميرات</strong> تبدأ قريبًا",
  "Low attendance flagged in <strong>Fire Alarm Systems</strong>": "انخفاض الحضور في <strong>أنظمة إنذار الحريق</strong>",

  /* ---- content protection / print ---- */
  "This material is protected and cannot be printed.": "هذه المادة محمية ولا يمكن طباعتها.",

  /* ---- certificates page ---- */
  "Your Certificates": "شهاداتك",
  "Earn a verified certificate for every course you complete. Each one carries a unique code and QR authentication.":
    "احصل على شهادة موثّقة لكل دورة تُكملها، تحمل رمزًا فريدًا وتحققًا عبر رمز QR.",
  "Certificate Verification": "التحقق من الشهادة",
  "This certificate is authentic": "هذه الشهادة أصلية",
  "Locked": "مقفلة",
  "Verification:": "التحقق:",
  "Issued:": "تاريخ الإصدار:",

  /* ---- profile fields ---- */
  "Full Name": "الاسم الكامل",
  "Email": "البريد الإلكتروني",
  "Program": "البرنامج",
  "General account and course emails": "رسائل الحساب والدورات العامة",
  "Get nudged before due dates": "تنبيهك قبل مواعيد الاستحقاق",
  "Alerts 15 minutes before sessions": "تنبيهات قبل الجلسات بـ 15 دقيقة",
  "When a new certificate is issued": "عند إصدار شهادة جديدة",
  "Nudges for pending submissions": "تنبيهات للتسليمات المعلّقة",
  "Alerts before your live sessions": "تنبيهات قبل جلساتك المباشرة",
  "When a student submits work": "عند تسليم أحد الطلاب لعمله",
  "Direct messages from students": "رسائل مباشرة من الطلاب",

  /* ---- attendance legend ---- */
  "No session": "لا جلسة",
  "Today": "اليوم",

  /* ---- activity feed fragments ---- */
  "Earned the": "حصلت على",
  "certificate": "شهادة",
  "Submitted assignment": "أرسلت الواجب",
  "Joined live session": "انضممت إلى جلسة مباشرة",
  "Received grade": "حصلت على درجة",
  "Welcome to CORE Egypt — your activity will appear here": "مرحبًا بك في CORE Egypt — سيظهر نشاطك هنا",
  "View all →": "عرض الكل",

  /* ---- misc ---- */
  "Database not connected": "قاعدة البيانات غير متصلة",
  "Day": "اليوم",
  "of your journey": "من رحلتك",
  "active courses": "دورات نشطة",
  "students taught": "طالب مُدرّس",
  "student": "طالب",
  "students": "طلاب",

  "English": "English",
  "العربية": "العربية",
};

function t(s) {
  if (s == null) return s;
  return (LANG === "ar" && AR[s]) ? AR[s] : s;
}

/* Walk text nodes and translate any whose exact text is a known UI string.
   This catches JS-rendered content without wrapping every string in t().
   Data (names, course titles, dates) never matches a dictionary key. */
var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1 };
function translateNode(node) {
  var raw = node.nodeValue;
  var key = raw.trim();
  if (key && AR[key]) node.nodeValue = raw.replace(key, AR[key]);
}
function translateTree(root) {
  if (LANG !== "ar" || !root) return;
  if (root.nodeType === 3) { translateNode(root); return; }
  if (root.nodeType !== 1) return;
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      var p = n.parentNode;
      if (p && (SKIP_TAGS[p.nodeName] || p.namespaceURI === "http://www.w3.org/2000/svg")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  var nodes = [], n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(translateNode);
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
  translateTree(document.body);
  /* Pages without the portal header (login, register, verify…) get a
     floating toggle so the language can always be switched. */
  if (!document.querySelector("[data-lang-toggle]")) {
    var b = document.createElement("div");
    b.className = "lang-toggle-floating";
    b.innerHTML = langToggleHTML();
    document.body.appendChild(b);
  }
  /* Translate content rendered later by page scripts (dashboards, tables…) */
  if (LANG === "ar" && window.MutationObserver) {
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        mu.addedNodes.forEach(function (node) { translateTree(node); });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
});
