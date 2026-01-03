/**
 * Docker Healthcheck Script
 * Simple HTTP check to verify the application is responding
 */

import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000,
  method: 'GET'
};

const healthCheck = http.request(options, (res) => {
  console.log(`Healthcheck status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.error('Healthcheck failed:', err.message);
  process.exit(1);
});

healthCheck.on('timeout', () => {
  console.error('Healthcheck timeout');
  healthCheck.destroy();
  process.exit(1);
});

healthCheck.end();
