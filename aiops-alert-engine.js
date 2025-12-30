// Day 19 - AIOps Alerting Engine (Webhook Simulation)

const fs = require("fs");
const http = require("http");

let lastSize = 0;
let errorHistory = [];
const WINDOW = 5;

function sendAlert(message) {
  console.log("🚨 ALERT SENT");
  console.log("📩 Message:", message);
}

function detectAnomaly(value) {
  if (errorHistory.length < WINDOW) return false;
  const avg = errorHistory.reduce((a, b) => a + b, 0) / errorHistory.length;
  return value > avg * 1.5;
}

setInterval(() => {
  if (!fs.existsSync("app-logs.txt")) return;

  const data = fs.readFileSync("app-logs.txt", "utf8");
  const lines = data.split("\n").slice(-10);

  let errors = 0;
  lines.forEach(line => {
    if (line.includes("ERROR") || line.includes("FAILED")) {
      errors++;
    }
  });

  errorHistory.push(errors);
  if (errorHistory.length > WINDOW) errorHistory.shift();

  if (detectAnomaly(errors)) {
    sendAlert(`Anomaly detected | Error spike: ${errors}`);
  } else {
    console.log("✅ System stable — no alert");
  }
}, 5000);
