import express from 'express';
import routes from './routes'
import bodyParser from 'body-parser';
import keycloak from './keycloack-config/keycloack';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger-config';

class App {
    constructor() {
      this.server = express();
      this.middlewares();
      this.routes();
    }

    middlewares() {
      this.server.use(express.json());
      this.server.use(bodyParser.json());
      this.server.use(bodyParser.urlencoded({ extended: false }));
      this.server.use(keycloak.middleware());
      this.server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

    }
  
    routes() {
      this.server.use(routes);
    }
  }
  export default new App().server;