const http = require('http');

const urls = [
  'http://127.0.0.1:5000/health',
  'http://localhost:5000/health',
  'http://192.168.1.5:5000/health'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    console.log(`Testing GET ${url}...`);
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ success: true, status: res.statusCode, body: data });
      });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ success: false, error: 'TIMEOUT' });
    });
  });
}

async function run() {
  for (const url of urls) {
    const res = await testUrl(url);
    if (res.success) {
      console.log(`✅ SUCCESS on ${url}!`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Body: ${res.body}`);
    } else {
      console.log(`❌ FAILED on ${url}: ${res.error}`);
    }
    console.log('------------------------------------');
  }
}

run();
