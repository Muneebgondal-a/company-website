// Day 12 - AIOps Log Collector

const fs = require('fs');

function logEvent(message) {
    const time = new Date().toISOString();
    const log = `[${time}] ${message}\n`;

    fs.appendFileSync('app-logs.txt', log);
    console.log(log.trim());
}

// Simulating application events
setInterval(() => {
    const events = [
        "User accessed homepage",
        "API request received",
        "Database query executed",
        "Health check OK",
        "Background job completed"
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    logEvent(randomEvent);
}, 4000);
