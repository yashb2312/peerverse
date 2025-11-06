// Simple TURN server connectivity test
const net = require('net');
const dgram = require('dgram');

const turnServers = [
  {
    host: 'relay1.expressturn.com',
    port: 3480,
    username: '000000002074822364',
    credential: 'WnbuuoA398ZVw+A920nzNkU8eiw='
  },
  {
    host: 'numb.viagenie.ca',
    port: 3478,
    username: 'webrtc@live.com',
    credential: 'muazkh'
  },
  {
    host: 'openrelay.metered.ca',
    port: 80,
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

async function testTurnServer(server) {
  return new Promise((resolve) => {
    console.log(`Testing ${server.host}:${server.port}...`);
    
    const socket = net.createConnection(server.port, server.host);
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ ...server, status: 'TIMEOUT' });
    }, 5000);
    
    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ ...server, status: 'CONNECTED' });
    });
    
    socket.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ ...server, status: 'ERROR', error: err.message });
    });
  });
}

async function testAllServers() {
  console.log('Testing TURN server connectivity...\n');
  
  for (const server of turnServers) {
    const result = await testTurnServer(server);
    console.log(`${result.host}:${result.port} - ${result.status}`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }
}

testAllServers().catch(console.error);