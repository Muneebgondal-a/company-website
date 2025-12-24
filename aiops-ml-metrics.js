// Day 16 - AIOps ML Metrics Exporter

const fs = require("fs");
const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 9100;

const anomalyGauge = new client.Gauge({
  name: "aiops_anomaly_detected",
  help: "ML-based anomaly detection flag (1 = anomaly, 0 = normal)"
});

let lastSize = 0;
let history = [];
const WINDOW = 5;

function detectAnomaly(value) {
  if (history.length < WINDOW) return false;
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
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

  history.push(errors);
  if (history.length > WINDOW) history.shift();

  if (detectAnomaly(errors)) {
    anomalyGauge.set(1);
    console.log("🚨 ML anomaly exported to Prometheus");
  } else {
    anomalyGauge.set(0);
    console.log("✅ Normal behavior");
  }
}, 5000);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`📊 AIOps metrics server running on port ${PORT}`);
});
