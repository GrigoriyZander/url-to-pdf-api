const config = require('./config');
const Raven = require('raven');
const logger = require('./util/logger')(__filename);
const morgan = require('morgan');
const errorLogger = require('./middleware/error-logger');

if (config.NODE_ENV === 'production') {
  logger.info('Initializing Sentry express middleware');
  if (!config.SENTRY_KEY) {
    logger.error('SENTRY_KEY not specified');
    process.exit(1);
  }
  Raven.config(config.SENTRY_KEY).install();
  logger.info('Initializing Sentry express middleware success.');
  module.exports = {
    captureException: Raven.captureException,
    requestHandler: Raven.requestHandler,
    errorHandler: Raven.errorHandler,
  };
} else {
  module.exports = {
    captureException: logger.error,
    requestHandler: () => morgan('dev'),
    errorHandler: errorLogger,
  };
}
