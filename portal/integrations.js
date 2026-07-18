/* =========================================================
   CORE Egypt — MEETING PLATFORM INTEGRATIONS (Zoom / Meet / Teams)

   BACKEND NOTE: The real APIs for creating meetings programmatically
   (Zoom Server-to-Server OAuth "Create Meeting", Google Calendar API
   with conferenceData.createRequest for Meet, Microsoft Graph
   /me/onlineMeetings for Teams) all require OAuth client secrets and
   MUST run on a server — they cannot live in a static frontend.
   This module centralizes every platform call behind one interface so
   those server endpoints can be swapped in later without touching the
   pages. Until then it uses each platform's public deep links, which
   work with the host's own signed-in account.
   ========================================================= */

var MEETING_PLATFORMS = {
  zoom: {
    name: "Zoom",
    color: "#2D8CFF",
    // Opens Zoom's "start instant meeting" flow for the signed-in host
    newMeetingUrl: "https://zoom.us/start/videomeeting",
    // Real backend swap: POST /api/meetings {platform:"zoom"} -> Zoom API v2 /users/me/meetings
    joinHint: "zoom.us/j/…",
  },
  meet: {
    name: "Google Meet",
    color: "#00832D",
    // meet.google.com/new instantly creates a meeting for the signed-in Google account
    newMeetingUrl: "https://meet.google.com/new",
    // Real backend swap: Google Calendar API events.insert + conferenceData.createRequest
    joinHint: "meet.google.com/…",
  },
  teams: {
    name: "Microsoft Teams",
    color: "#6264A7",
    // Teams "Meet now" flow for the signed-in Microsoft account
    newMeetingUrl: "https://teams.live.com/meet",
    // Real backend swap: Microsoft Graph POST /me/onlineMeetings
    joinHint: "teams.live.com/meet/…",
  },
};

function platformOf(key) { return MEETING_PLATFORMS[key] || null; }

/* Pill badge shown on session cards: colored dot + platform name */
function platformBadgeHTML(key) {
  var p = platformOf(key);
  if (!p) return "";
  return '<span class="mtg-badge" style="--mtg:' + p.color + ';">' +
         '<i aria-hidden="true"></i>' + p.name + "</span>";
}

/* HOST action: open the platform's create-meeting flow (host account signs in there) */
function createInstantMeeting(key) {
  var p = platformOf(key);
  if (!p) { showToast("Choose a meeting platform first"); return; }
  window.open(p.newMeetingUrl, "_blank", "noopener");
}

/* ATTENDEE action: join a scheduled session's meeting */
function joinMeeting(session) {
  if (session && session.meetingUrl) {
    window.open(session.meetingUrl, "_blank", "noopener");
  } else {
    showToast("No meeting link has been added for this session yet");
  }
}

/* <option> list for platform selects */
function platformOptionsHTML(selected) {
  return Object.keys(MEETING_PLATFORMS).map(function (k) {
    return '<option value="' + k + '"' + (k === selected ? " selected" : "") + ">" +
           MEETING_PLATFORMS[k].name + "</option>";
  }).join("");
}
