// Day 15 - ML-style Anomaly Detection (Baseline Learning)

const fs = require("fs");

let lastSize = 0;
let errorHistory = [];
const WINDOW_SIZE = 5;

function detectAnomaly(errorRate) {
    if (errorHistory.length < WINDOW_SIZE) return false;

    const avg =
        errorHistory.reduce((a, b) => a + b, 0) / errorHistory.length;

    return errorRate > avg * 1.5; // dynamic baseline
}

setInterval(() => {
    if (!fs.existsSync("app-logs.txt")) return;

    const stats = fs.statSync("app-logs.txt");
    let errorCount = 0;

    if (stats.size > lastSize) {
        const data = fs.readFileSync("app-logs.txt", "utf8");
        const lines = data.split("\n").slice(-10);

        lines.forEach(line => {
            if (line.includes("ERROR") || line.includes("FAILED")) {
                errorCount++;
            }
        });

        errorHistory.push(errorCount);
        if (errorHistory.length > WINDOW_SIZE) {
            errorHistory.shift();
        }

        if (detectAnomaly(errorCount)) {
            console.log("🚨 ML ANOMALY DETECTED!");
            console.log(`📈 Error spike detected: ${errorCount}`);
        } else {
            console.log(`📊 Normal behavior | Errors: ${errorCount}`);
        }

        lastSize = stats.size;
    }
}, 5000);
