const http = require('http');

const url = 'http://localhost:5000/health';

console.log(`Sending GET request to ${url}...`);

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`✅ Success! Response status code: ${res.statusCode}`);
    console.log(`Response body: ${data}`);
    process.exit(0);
  });
}).on('error', (err) => {
  console.log(`❌ ERROR: Could not reach the backend server.`);
  console.log(`Reason: ${err.message}`);
  process.exit(1);
});
