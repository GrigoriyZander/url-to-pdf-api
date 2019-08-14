const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const logger = require('./util/logger')(__filename);
const errorResponder = require('./middleware/error-responder');
const requireHttps = require('./middleware/require-https');
const createRouter = require('./router');
const config = require('./config');
const sentry = require('./sentry');

function createApp() {
  const app = express();
  // App is served behind Heroku's router.
  // This is needed to be able to use req.ip or req.secure
  app.enable('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(sentry.requestHandler());

  if (!config.ALLOW_HTTP) {
    logger.info('All requests require HTTPS.');
    app.use(requireHttps());
  } else {
    logger.info('ALLOW_HTTP=true, unsafe requests are allowed. Don\'t use this in production.');
  }

  const corsOpts = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    credentials: true,
  };
  logger.info('Using CORS options:', corsOpts);
  app.use(cors(corsOpts));

  // Limit to 10mb if HTML has e.g. inline images
  app.use(bodyParser.text({ limit: '10mb', type: 'text/html' }));
  app.use(bodyParser.json({ limit: '10mb' }));

  app.use(cookieParser());
  app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10,
  }));

  // Initialize routes
  const router = createRouter();
  app.use('/', router);

  app.use(sentry.errorHandler());

  app.use(errorResponder());

  return app;
}

module.exports = createApp;
