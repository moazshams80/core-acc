/* =========================================================
   CORE Egypt — GOOGLE CALENDAR INTEGRATION (real, frontend OAuth)

   Creates a Calendar event with an auto-generated Google Meet link
   using events.insert + conferenceData.createRequest — the API behind
   the calendar#calendar resource's conferenceProperties
   ("allowedConferenceSolutionTypes": ["hangoutsMeet"]).

   Unlike Zoom / Teams, Google supports browser-side OAuth via Google
   Identity Services (token flow) with NO client secret, so this works
   from a static site.

   SETUP (one time, ~5 minutes):
   1. console.cloud.google.com → create a project
   2. "APIs & Services" → enable **Google Calendar API**
   3. OAuth consent screen → External → add yourself as a test user
   4. Credentials → Create OAuth Client ID → **Web application**
      Authorized JavaScript origins:
        http://localhost:8000
        https://YOUR-APP.vercel.app
   5. Paste the client ID below.
   Until a client ID is set, the module runs in DEMO mode and returns
   a mock Meet link so the flow is still demonstrable.
   ========================================================= */

var GOOGLE_CLIENT_ID = ""; // e.g. "1234567890-abc123.apps.googleusercontent.com"

var gcalToken = null;
var gcalTokenClient = null;

function gcalReady() { return !!GOOGLE_CLIENT_ID; }
function gcalConnected() { return !!gcalToken; }

/* Load the Google Identity Services script on demand */
function gcalLoadGis(cb) {
  if (window.google && google.accounts && google.accounts.oauth2) { cb(); return; }
  var s = document.createElement("script");
  s.src = "https://accounts.google.com/gsi/client";
  s.onload = cb;
  s.onerror = function () { showToast("Could not load Google sign-in"); };
  document.head.appendChild(s);
}

/* OAuth popup → access token with calendar.events scope */
function gcalConnect(cb) {
  if (!gcalReady()) { showToast("Demo mode — add your Google client ID in google-calendar.js"); return; }
  gcalLoadGis(function () {
    if (!gcalTokenClient) {
      gcalTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: function (resp) {
          if (resp && resp.access_token) {
            gcalToken = resp.access_token;
            showToast("Google Calendar connected");
            if (cb) cb();
          }
        },
      });
    }
    gcalTokenClient.requestAccessToken();
  });
}

/* Create a Calendar event with a real Meet link.
   opts: { title, startISO, durationMin } → done(err, { hangoutLink, htmlLink, demo }) */
function gcalCreateMeetEvent(opts, done) {
  /* DEMO fallback so the UX is testable before a client ID is configured */
  if (!gcalReady()) {
    setTimeout(function () {
      done(null, { hangoutLink: "https://meet.google.com/dem-omee-ting", demo: true });
    }, 400);
    return;
  }
  if (!gcalConnected()) { gcalConnect(function () { gcalCreateMeetEvent(opts, done); }); return; }

  var start = opts.startISO ? new Date(opts.startISO) : new Date(Date.now() + 3600000);
  var end = new Date(start.getTime() + (opts.durationMin || 60) * 60000);

  fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
    method: "POST",
    headers: { "Authorization": "Bearer " + gcalToken, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: opts.title || "CORE Egypt Live Session",
      description: "Scheduled from the CORE Egypt instructor portal.",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      conferenceData: {
        createRequest: {
          requestId: "core-" + Date.now(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  })
    .then(function (r) {
      if (r.status === 401) { gcalToken = null; throw new Error("Session expired — click again to reconnect"); }
      if (!r.ok) throw new Error("Google Calendar error (HTTP " + r.status + ")");
      return r.json();
    })
    .then(function (ev) { done(null, { hangoutLink: ev.hangoutLink, htmlLink: ev.htmlLink }); })
    .catch(function (e) { done(e); });
}
