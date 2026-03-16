const http = require('http');

const AI_BASE = process.env.AI_SERVICE_URL || 'http://localhost:5001';

function aiPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(AI_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 5001,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('Invalid JSON from AI service')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('AI service timeout')); });
    req.write(data);
    req.end();
  });
}

async function getRiskScore(userData) {
  try {
    const res = await aiPost('/api/risk-score', userData);
    return res.data || null;
  } catch {
    return null; // fallback gracefully
  }
}

async function runFraudCheck(payload) {
  try {
    const res = await aiPost('/api/fraud-check', payload);
    return res.data || null;
  } catch {
    return null;
  }
}

async function predictIncomeLoss(payload) {
  try {
    const res = await aiPost('/api/predict-income', payload);
    return res.data || null;
  } catch {
    return null;
  }
}

async function assessWorker(payload) {
  try {
    const res = await aiPost('/api/assess-worker', payload);
    return res.data || null;
  } catch {
    return null;
  }
}

module.exports = { getRiskScore, runFraudCheck, predictIncomeLoss, assessWorker };
