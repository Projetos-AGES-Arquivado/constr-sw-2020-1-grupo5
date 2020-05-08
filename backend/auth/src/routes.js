import { Router } from 'express';
import buildingController from './controller/buildingController';
import oauthController from './controller/oauthController';

const routes = new Router();


//Authorization
routes.get('/ping', oauthController.get)
routes.post('/login', oauthController.post)

//Building CRUD
routes.get('/buildings', buildingController.get)

//Room CRUD



export default routes;