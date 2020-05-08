import express from 'express';
import routes from './routes'
import bodyParser from 'body-parser';
import keycloak from './keycloack-config/keycloack';

class App {
    constructor() {
      this.server = express();
      this.middlewares();
      this.routes();
    }

    middlewares() {
      this.server.use(express.json());
      this.server.use(bodyParser.json());
      this.server.use(bodyParser.urlencoded({ extended: true }));
      this.server.use(keycloak.middleware());

    }
  
    routes() {
      this.server.use(routes);
    }
  }
  export default new App().server;