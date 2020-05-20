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
routes.get('/buildings/:buildingID', buildingController.getOne)
routes.post('/buildings', buildingController.insert)
routes.put('/buildings/:buildingID', buildingController.update)
routes.delete('/buildings/:buildingID', buildingController.delete)


//Room CRUD
routes.get('/buildings/:buildingID/rooms', roomController.getAll)
routes.get('/buildings/:buildingID/rooms/:roomID', roomController.getOne)
routes.post('/buildings/:buildingID/rooms', roomController.insert)
routes.put('/buildings/:buildingID/rooms/:roomID', roomController.update)
routes.delete('/buildings/:buildingID/rooms/:roomID', roomController.delete)



export default routes;