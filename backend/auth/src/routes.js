import { Router } from 'express';
import buildingController from './controller/buildingController';
import oauthController from './controller/oauthController';
import roomController from './controller/roomController';

const routes = new Router();


//Authorization
routes.get('/ping', oauthController.get)
routes.post('/login', oauthController.post)

//Building CRUD
routes.get('/predios', buildingController.getAll)
routes.post('/predios', buildingController.insert)
routes.put('/predio=:buildingId', buildingController.update)

//Room CRUD
routes.get('/predio=:buildingId/salas', roomController.getAll)
routes.post('/predio=:buildingId/salas', roomController.insert)
routes.put('/predio=:buildingId/sala=:roomId', roomController.update)



export default routes;