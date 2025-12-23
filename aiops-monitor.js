// AIOps Day 11 - Basic Monitoring Script

setInterval(() => {
    const memory = process.memoryUsage().rss / 1024 / 1024;
    const cpu = process.cpuUsage().user / 1000000;

    console.log(`📊 AIOps Monitor | Memory: ${memory.toFixed(2)} MB | CPU Time: ${cpu.toFixed(2)} ms`);
}, 5000);
