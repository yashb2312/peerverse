// TURN Server Connectivity Test Utility
export const testTurnConnectivity = async (iceServers) => {
  return new Promise((resolve) => {
    const results = [];
    let completedTests = 0;
    const totalTests = iceServers.filter(server => server.urls.some(url => url.startsWith('turn:'))).length;
    
    if (totalTests === 0) {
      resolve([]);
      return;
    }
    
    iceServers.forEach((server, index) => {
      const turnUrls = server.urls.filter(url => url.startsWith('turn:'));
      if (turnUrls.length === 0) return;
      
      const pc = new RTCPeerConnection({ iceServers: [server] });
      const startTime = Date.now();
      let testCompleted = false;
      
      const completeTest = (status, latency = null) => {
        if (testCompleted) return;
        testCompleted = true;
        
        results.push({
          serverIndex: index,
          urls: turnUrls,
          username: server.username,
          status,
          latency,
          timestamp: new Date().toISOString()
        });
        
        completedTests++;
        pc.close();
        
        if (completedTests === totalTests) {
          resolve(results);
        }
      };
      
      // Test timeout
      const timeout = setTimeout(() => {
        completeTest('timeout');
      }, 5000);
      
      pc.onicecandidate = (event) => {
        if (event.candidate && event.candidate.type === 'relay') {
          const latency = Date.now() - startTime;
          clearTimeout(timeout);
          completeTest('connected', latency);
        }
      };
      
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete' && !testCompleted) {
          clearTimeout(timeout);
          completeTest('no_relay_candidate');
        }
      };
      
      // Create a data channel to trigger ICE gathering
      pc.createDataChannel('test');
      pc.createOffer().then(offer => {
        return pc.setLocalDescription(offer);
      }).catch(error => {
        clearTimeout(timeout);
        completeTest('error');
      });
    });
  });
};

export const getBestTurnServers = (testResults) => {
  const workingServers = testResults
    .filter(result => result.status === 'connected')
    .sort((a, b) => (a.latency || 9999) - (b.latency || 9999));
  
  return workingServers.length > 0 ? workingServers : testResults;
};

export const logTurnTestResults = (results) => {
  console.log('🧪 TURN Server Test Results:');
  results.forEach(result => {
    const status = result.status === 'connected' ? '✅' : 
                  result.status === 'timeout' ? '⏰' : 
                  result.status === 'no_relay_candidate' ? '⚠️' : '❌';
    const latency = result.latency ? ` (${result.latency}ms)` : '';
    console.log(`${status} ${result.urls[0]} ${latency}`);
  });
};