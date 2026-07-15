const net = require('net');

const port = 1433;
const host = 'localhost';

console.log(`Connecting to ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(2000);

socket.on('connect', () => {
  console.log('✅ SUCCESS: Connection established! Port 1433 is open.');
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  console.log('❌ TIMEOUT: Connection timed out. The port is blocked or not configured.');
  socket.destroy();
  process.exit(1);
});

socket.on('error', (err) => {
  console.log(`❌ ERROR: Connection failed. Reason: ${err.message}`);
  socket.destroy();
  process.exit(1);
});

socket.connect(port, host);
