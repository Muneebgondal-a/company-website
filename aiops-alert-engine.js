// Day 20 - AIOps Alert Engine with Slack Integration

const fs = require("fs");
const axios = require("axios");

// 👉 ADD YOUR SLACK WEBHOOK URL HERE
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";

let errorHistory = [];
const WINDOW = 5;

// Send message to Slack
async function sendSlackAlert(message) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `🚨 *AIOps Alert*\n${message}`
    });
    console.log("📩 Slack alert sent");
  } catch (error) {
    console.log("❌ Slack error:", error.message);
  }
}

// ML-style anomaly detection
function detectAnomaly(value) {
  if (errorHistory.length < WINDOW) return false;
  const avg = errorHistory.reduce((a, b) => a + b, 0) / errorHistory.length;
  return value > avg * 1.5;
}

// Monitor logs every 5 seconds
setInterval(async () => {
  if (!fs.existsSync("app-logs.txt")) return;

  const lines = fs.readFileSync("app-logs.txt", "utf8")
    .split("\n")
    .slice(-10);

  let errors = 0;
  lines.forEach(line => {
    if (line.includes("ERROR") || line.includes("FAILED")) {
      errors++;
    }
  });

  errorHistory.push(errors);
  if (errorHistory.length > WINDOW) errorHistory.shift();

  if (detectAnomaly(errors)) {
    await sendSlackAlert(`Anomaly detected | Error spike: ${errors}`);
  } else {
    console.log("✅ System stable");
  }
}, 5000);
