import { Router as router } from 'express';
import { config } from '../../config/application-config';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
const log = require('../../config/log').logger();

export default app => {
  log.info('Starting middleware...');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(compression());
  app.use(helmet());
  app.use(
    cors({
      exposedHeaders: ['Link'],
      origin: true,
      credentials: true
    })
  );

  log.info('Biomodel API middleware loaded successfully');

  if (config.get('livereload.enabled')) {
    app.use(
      require('connect-livereload')({
        src: `http://${config.get('livereload.server')}:${config.get(
          'livereload.port'
        )}/livereload.js`
      })
    );
  }

  if (config.get('logs.http')) {
    log.stream = {
      write: function(message, encoding) {
        log.info(message);
      }
    };

    app.use(require('morgan')('combined', { stream: log.stream }));
  }
};
