const client = require("prom-client");

const memoryGauge = new client.Gauge({
  name: "app_memory_usage_mb",
  help: "Memory usage in MB"
});

setInterval(() => {
  const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
  memoryGauge.set(memoryUsage);

  if (memoryUsage > 300) {
    console.log("🚨 ANOMALY DETECTED: High memory usage:", memoryUsage.toFixed(2), "MB");
  } else {
    console.log("✅ Memory normal:", memoryUsage.toFixed(2), "MB");
  }
}, 5000);
