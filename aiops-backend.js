// Day 21 - AIOps Backend API
const path = require("path");

const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 4000;

let errorHistory = [];
const WINDOW = 5;
let currentStatus = "Normal";

function detectAnomaly(value) {
  if (errorHistory.length < WINDOW) return false;
  const avg = errorHistory.reduce((a, b) => a + b, 0) / errorHistory.length;
  return value > avg * 1.5;
}

setInterval(() => {
  if (!fs.existsSync("app-logs.txt")) return;

  const lines = fs.readFileSync("app-logs.txt", "utf8")
    .split("\n")
    .slice(-10);

  let errors = 0;
  lines.forEach(line => {
    if (line.includes("ERROR") || line.includes("FAILED")) errors++;
  });

  errorHistory.push(errors);
  if (errorHistory.length > WINDOW) errorHistory.shift();

  if (detectAnomaly(errors)) {
    currentStatus = "Anomaly Detected";
  } else {
    currentStatus = "Normal";
  }
}, 5000);

// API endpoint
app.get("/status", (req, res) => {
  res.json({
    status: currentStatus,
    timestamp: new Date()
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 AIOps backend running on port ${PORT}`);
});
