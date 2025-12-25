// Day 17 - AIOps Self-Healing Engine

const fs = require("fs");

let lastSize = 0;
let errorHistory = [];
const WINDOW = 5;

function restartService() {
  console.log("🔁 SELF-HEALING ACTION TRIGGERED");
  console.log("🚀 Simulating service restart...");
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
  lines.forEach(l => {
    if (l.includes("ERROR") || l.includes("FAILED")) errors++;
  });

  errorHistory.push(errors);
  if (errorHistory.length > WINDOW) errorHistory.shift();

  if (detectAnomaly(errors)) {
    console.log("🚨 ANOMALY DETECTED");
    restartService();
  } else {
    console.log("✅ System stable");
  }
}, 5000);
