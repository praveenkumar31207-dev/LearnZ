const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const MODE = process.argv[2] === 'prod' ? 'start' : 'dev';

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log('\x1b[36m%s\x1b[0m', `==============================================`);
console.log('\x1b[32m%s\x1b[0m', `  🚀 Starting LearnZ local server (${MODE} mode)...`);
console.log('\x1b[36m%s\x1b[0m', `==============================================`);

// Spawn Next.js directly via node runtime to bypass any PowerShell execution policy issues
const nextProcess = spawn(process.execPath, [nextBin, MODE, '-p', PORT.toString()], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: PORT.toString(),
  },
});

nextProcess.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', `Failed to start Next.js process:`, err);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.log('\x1b[33m%s\x1b[0m', `Server process exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Handle graceful termination
const handleExit = () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down server gracefully...');
  nextProcess.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
