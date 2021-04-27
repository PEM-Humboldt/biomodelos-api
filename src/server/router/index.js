import fs from 'fs';
import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import { config } from '../../config/application-config';

export default app => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readdirSync(`${config.get('appSrc')}/api`).forEach(route => {
    if (!config.get('router.ignore').includes(route)) {
      if (route === 'tools') {
        app.use(
          `/tools`,
          // eslint-disable-next-line security/detect-non-literal-require
          require(`${config.get('appSrc')}/api/${route}`).default
        );
      } else if (route.charAt(0) !== '_' && route.charAt(0) !== '.') {
        app.use(
          `/v2/${route}`,
          // eslint-disable-next-line security/detect-non-literal-require
          require(`${config.get('appSrc')}/api/${route}`).default
        );
      }
    }
  });

  app.use(express.static(`${config.get('appSrc')}/views`));
  app.use(favicon(path.join(config.get('appSrc'), 'views', 'favicon.ico')));

  // Enable API documentation folder path
  if (config.get('swagger.enabled'))
    app.use('/api-doc', express.static(`${config.get('appRoot')}/api-doc`));

  // Handle 404
  app.use(function(req, res) {
    res.status(404).sendFile(`${config.get('appSrc')}/views/404.html`);
  });

  // Handle 500
  app.use(function(error, req, res, next) {
    res.send('500: Internal Server Error', 500);
  });
};
