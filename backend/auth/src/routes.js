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
routes.get('/building/:buildingId', buildingController.getOne)
routes.post('/buildings', buildingController.insert)
routes.put('/building/:buildingId', buildingController.update)
routes.delete('/building/:buildingId', buildingController.delete)


//Room CRUD
routes.get('/building/:buildingId/rooms', roomController.getAll)
routes.get('/building/:buildingId/room/:roomId', roomController.getOne)
routes.post('/building/:buildingId/rooms', roomController.insert)
routes.put('/building/:buildingId/room/:roomId', roomController.update)
routes.delete('/building/:buildingId/room/:roomId', roomController.delete)



export default routes;