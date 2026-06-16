# CORE Academy — Student Portal

A frontend-only **Student Portal** prototype for CORE Academy, built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no backend. All data is mocked.

## Live demo (local)

Serve the folder with any static server, e.g.:

```bash
python -m http.server 8000
```

Then open: <http://127.0.0.1:8000/portal/login.html>

> Login "succeeds" with any input — it's a UI/UX prototype, not a secured system.

## Pages

| File | Description |
|------|-------------|
| `portal/login.html` | Split-screen student login |
| `portal/dashboard.html` | Stats, continue-learning, upcoming, activity feed |
| `portal/courses.html` | Enrolled courses with progress + filters |
| `portal/course-detail.html` | Overview + module accordion |
| `portal/assignments.html` | Assignment table + submit modal |
| `portal/live-sessions.html` | Upcoming + past live sessions |
| `portal/attendance.html` | Attendance donut + calendar |
| `portal/grades.html` | Grade summary + per-course breakdown |
| `portal/certificates.html` | Gold-accent certificates + verification modal |
| `portal/profile.html` | Profile + settings + notification toggles |

## Architecture

- `portal/portal.css` — self-contained design system (CORE navy/cyan + gold certificate accent), app shell, and all components.
- `portal/portal.js` — shared sidebar/header shell, session gate, and render helpers.
- `portal/mock-data.js` — single source of truth for all mock data.

Fully responsive (sidebar collapses to a drawer below 1024px) with RTL support.
