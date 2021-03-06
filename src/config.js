/* eslint-disable no-process-env */

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

// Env vars should be casted to correct types
const config = {
  PORT: Number(process.env.PORT) || 9000,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  ALLOW_HTTP: process.env.ALLOW_HTTP === 'true',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  API_TOKENS: [],
  CHROME_EXECUTABLE: process.env.CHROME_EXECUTABLE,
  TARGET_HOST: process.env.SKYEER_FRONT_HOST,
  SENTRY_KEY: process.env.SENTRY_DSN,
};

if (process.env.API_TOKENS) {
  config.API_TOKENS = process.env.API_TOKENS.split(',');
}

module.exports = config;
