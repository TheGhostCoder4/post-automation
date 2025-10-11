// cron-twitter.js
// Run with: node cron-twitter.js
// Requires: npm install node-cron
// Node.js 18+ recommended (fetch is built-in)

const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const TWEET_URL = process.env.TWEET_URL || "http://localhost:3000/api/tweet"; // your Next.js Twitter route
const LOG_PATH = path.join(__dirname, "tweets.log");
const STATE_PATH = path.join(__dirname, "tweetState.json");

// Ensure state file exists
if (!fs.existsSync(STATE_PATH)) fs.writeFileSync(STATE_PATH, JSON.stringify({}), "utf8");

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8") || "{}");
  } catch {
    return {};
  }
}
function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}
function log(line) {
  const ts = new Date().toISOString();
  fs.appendFileSync(LOG_PATH, `${ts} ${line}\n`);
  console.log(line);
}

// Helper: call the Tweet API
async function postTweet(dryRun = false) {
  const url = dryRun ? `${TWEET_URL}?dryRun=true` : TWEET_URL;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({ success: false, error: "Invalid JSON response" }));
  return data;
}

// Core job logic
async function runTwitterJob(label, dryRun = false) {
  const today = new Date().toISOString().slice(0, 10);
  const state = readState();
  state[label] = state[label] || {};

  if (!dryRun && state[label].lastPosted === today) {
    log(`${label} skipped — already posted today (${today})`);
    return;
  }

  log(`🕒 Running Twitter job (${label}) — dryRun=${dryRun}`);
  const data = await postTweet(dryRun);

  if (data?.success) {
    const msg = `${label} ✅ posted: ${data.tweetText || "Tweet success"}`;
    log(msg);
    if (!dryRun) {
      state[label].lastPosted = today;
      state[label].lastResponse = data;
      writeState(state);
    }
  } else {
    log(`${label} ❌ failed: ${data?.error || "Unknown error"}`);
  }
}

/* ────────────────────────────────
   🕐 Schedules (Asia/Kolkata)
   1️⃣ 9:00 AM IST
   2️⃣ 4:27 PM IST
──────────────────────────────── */

cron.schedule(
  "0 9 * * *",
  () => runTwitterJob("morning-9am", false),
  { timezone: "Asia/Kolkata" }
);

cron.schedule(
  "27 16 * * *",
  () => runTwitterJob("evening-16-27", false),
  { timezone: "Asia/Kolkata" }
);

// Optional manual test run: node cron-twitter.js test
const argv = process.argv.slice(2);
if (argv.includes("test")) {
  (async () => {
    log("🚀 Manual dry-run started...");
    await runTwitterJob("manual-test", true);
    log("✅ Manual test done. Exiting.");
    process.exit(0);
  })();
} else {
  log("✅ Cron running for Twitter posts at 09:00 and 16:27 Asia/Kolkata. (Ctrl+C to stop)");
}
