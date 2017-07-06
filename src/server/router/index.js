import fs from 'fs';
import { config } from '../../config/application-config';

export default app => {
  fs.readdirSync(`${config.get('appSrc')}/api`).forEach(route => {
    if (!config.get('router.ignore').includes(route))
      if (route.charAt(0) !== '_' && route.charAt(0) !== '.') {
        app.use(`/v2/${route}`, require(`../../api/${route}`).default);
      }
  });
};
