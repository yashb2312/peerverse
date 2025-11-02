// API URL Verification Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying API URL configurations...\n');

// Check config.js
const configPath = path.join(__dirname, 'FRONTEND', 'frontone', 'src', 'config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  console.log('📁 config.js content:');
  console.log(configContent);
  console.log('\n' + '='.repeat(50) + '\n');
  
  if (configContent.includes('gleaming-inspiration-production-5a37.up.railway.app')) {
    console.log('✅ config.js has the correct new API URL');
  } else if (configContent.includes('peerversefinal-production.up.railway.app')) {
    console.log('❌ config.js still has the old API URL');
  } else {
    console.log('⚠️  config.js API URL not found or different format');
  }
} else {
  console.log('❌ config.js not found');
}

// Check VideoCall.js
const videoCallPath = path.join(__dirname, 'FRONTEND', 'frontone', 'src', 'components', 'VideoCall.js');
if (fs.existsSync(videoCallPath)) {
  const videoCallContent = fs.readFileSync(videoCallPath, 'utf8');
  const socketLine = videoCallContent.split('\n').find(line => line.includes('socketConnection = io('));
  
  console.log('📁 VideoCall.js socket connection:');
  console.log(socketLine || 'Socket connection line not found');
  console.log('\n' + '='.repeat(50) + '\n');
  
  if (videoCallContent.includes('gleaming-inspiration-production-5a37.up.railway.app')) {
    console.log('✅ VideoCall.js has the correct new API URL');
  } else if (videoCallContent.includes('peerversefinal-production.up.railway.app')) {
    console.log('❌ VideoCall.js still has the old API URL');
  } else {
    console.log('⚠️  VideoCall.js API URL not found or different format');
  }
} else {
  console.log('❌ VideoCall.js not found');
}

// Check package.json for any scripts or configs
const packagePath = path.join(__dirname, 'FRONTEND', 'frontone', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  console.log('📁 package.json scripts:');
  console.log(JSON.stringify(packageJson.scripts, null, 2));
  
  if (packageJson.homepage) {
    console.log('\n📁 package.json homepage:', packageJson.homepage);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

console.log('🔧 Next Steps:');
console.log('1. If you see old URLs above, the files need to be updated');
console.log('2. Clear browser cache and localStorage');
console.log('3. Restart your development server');
console.log('4. If running on Vercel/Netlify, redeploy the frontend');
console.log('5. Check if NODE_ENV is set to "production" in your environment');