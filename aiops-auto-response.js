// Day 14 - AIOps Alerting & Auto-Response

const fs = require("fs");

let lastSize = 0;
let errorCount = 0;
const ERROR_THRESHOLD = 2;

function autoResponse() {
    console.log("🤖 AUTO-RESPONSE TRIGGERED");
    console.log("🔁 Simulating service restart...");
    errorCount = 0;
}

setInterval(() => {
    if (!fs.existsSync("app-logs.txt")) return;

    const stats = fs.statSync("app-logs.txt");

    if (stats.size > lastSize) {
        const stream = fs.createReadStream("app-logs.txt", {
            start: lastSize,
            end: stats.size
        });

        stream.on("data", chunk => {
            const lines = chunk.toString().split("\n");

            lines.forEach(line => {
                if (line.includes("ERROR") || line.includes("FAILED")) {
                    errorCount++;
                    console.log(`⚠️ Error detected (${errorCount}) → ${line}`);
                }

                if (errorCount >= ERROR_THRESHOLD) {
                    console.log("🚨 ALERT: System instability detected");
                    autoResponse();
                }
            });
        });

        lastSize = stats.size;
    }
}, 3000);
