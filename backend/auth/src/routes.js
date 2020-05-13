import { Router } from 'express';
import buildingController from './controller/buildingController';
import oauthController from './controller/oauthController';
import roomController from './controller/roomController';

const routes = new Router();


//Authorization
routes.get('/ping', oauthController.get)
routes.post('/login', oauthController.post)

//Building CRUD
routes.get('/buildings', buildingController.getAll)
routes.get('/buildings/:buildingId', buildingController.getOne)
routes.post('/buildings', buildingController.insert)
routes.put('/buildings/:buildingId', buildingController.update)
routes.delete('/buildings/:buildingId', buildingController.delete)


//Room CRUD
routes.get('/buildings/:buildingId/rooms', roomController.getAll)
routes.get('/buildings/:buildingId/rooms/:roomId', roomController.getOne)
routes.post('/buildings/:buildingId/rooms', roomController.insert)
routes.put('/buildings/:buildingId/rooms/:roomId', roomController.update)
routes.delete('/buildings/:buildingId/rooms/:roomId', roomController.delete)



export default routes;