/**
 * CropNexa — Baseline / Load Testing Suite
 * File: load-tests/baseline-load-test.js
 * 
 * Load Test Specification:
 * - Virtual Users (Connections): 100 Concurrent Virtual Users
 * - Duration: 60 Seconds (1 Minute Continuous Benchmark)
 * - Target URL: http://localhost:3000 (CropNexa Web Frontend & API Endpoints)
 * 
 * Metrics Measured:
 * - Requests Per Second (RPS)
 * - Latency (Min, Average, Max, p50, p90, p95, p99 ms)
 * - Throughput Bytes/sec
 * - Success vs Failure Rate (%)
 */

const autocannon = require('autocannon');
const path = require('path');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || '100', 10);
const DURATION_SECONDS = parseInt(process.env.DURATION || '60', 10);

async function runBaselineLoadTest() {
    console.log('⚡ Starting CropNexa Baseline Load Test...');
    console.log(`🎯 Target Endpoint : ${TARGET_URL}`);
    console.log(`👥 Concurrent Users : ${CONCURRENT_USERS} Virtual Users`);
    console.log(`⏱️ Duration        : ${DURATION_SECONDS} Seconds (1 Minute)\n`);

    const instance = autocannon({
        url: TARGET_URL,
        connections: CONCURRENT_USERS,
        duration: DURATION_SECONDS,
        pipelining: 1,
        requests: [
            { path: '/', method: 'GET' },
            { path: '/manifest.json', method: 'GET' },
            { path: '/reset-password', method: 'GET' }
        ]
    }, (err, result) => {
        if (err) {
            console.error('⚠️ Load Test Execution Error:', err);
            return;
        }

        console.log('====================================================');
        console.log('📊 CROPnEXA BASELINE LOAD TEST RESULTS SUMMARY');
        console.log('====================================================');
        console.log(`Total Requests Sent : ${result.requests.total.toLocaleString()} requests`);
        console.log(`Requests / Second   : ${result.requests.average.toFixed(1)} req/sec (RPS)`);
        console.log(`Bytes / Second      : ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/sec`);
        console.log(`Total Errors        : ${result.errors}`);
        console.log('----------------------------------------------------');
        console.log('⏱️ RESPONSE TIME (LATENCY METRICS)');
        console.log('----------------------------------------------------');
        console.log(`Fastest (Min)       : ${result.latency.min} ms`);
        console.log(`Average (Mean)      : ${result.latency.average.toFixed(1)} ms`);
        console.log(`Slowest (Max)       : ${result.latency.max} ms`);
        console.log(`50th Percentile (p50): ${result.latency.p50} ms`);
        console.log(`90th Percentile (p90): ${result.latency.p90} ms`);
        console.log(`95th Percentile (p95): ${result.latency.p95} ms`);
        console.log(`99th Percentile (p99): ${result.latency.p99} ms`);
        console.log('====================================================\n');

        // Save Raw Results JSON
        const rawJsonPath = path.join(__dirname, 'load-test-results.json');
        fs.writeFileSync(rawJsonPath, JSON.stringify(result, null, 2));
        console.log(`💾 Saved raw execution metrics to: ${rawJsonPath}`);
    });

    autocannon.track(instance, { renderProgressBar: true });
}

if (require.main === module) {
    runBaselineLoadTest();
}

module.exports = { runBaselineLoadTest };
