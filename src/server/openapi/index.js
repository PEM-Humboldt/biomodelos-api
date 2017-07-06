import swaggerJSDoc from 'swagger-jsdoc';
import { config } from '../../config/application-config';

export default (app, swaggerConfig) => {
  if (config.get('swagger.enabled')) {
    // options for the swagger docs
    let options = {
      // import swaggerDefinitions
      swaggerDefinition: swaggerConfig,
      // path to the API docs
      apis: [
        `${config.get('appSrc')}/api/**/*.yaml`,
        `${config.get('appSrc')}/api/**/*.js`
      ]
    };

    // initialize swagger-jsdoc
    let swaggerSpec = swaggerJSDoc(options);

    // serve swagger
    app.get('/swagger.json', function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.json(swaggerSpec);
    });
  }
};
