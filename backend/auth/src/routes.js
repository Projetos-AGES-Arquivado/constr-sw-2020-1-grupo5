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
routes.get('/predio=:buildingId', buildingController.getOne)
routes.post('/predios', buildingController.insert)
routes.put('/predio=:buildingId', buildingController.update)
routes.delete('/predio=:buildingId', buildingController.delete)


//Room CRUD
routes.get('/predio=:buildingId/salas', roomController.getAll)
routes.get('/predio=:buildingId/sala=:roomId', roomController.getOne)
routes.post('/predio=:buildingId/salas', roomController.insert)
routes.put('/predio=:buildingId/sala=:roomId', roomController.update)
routes.delete('/predio=:buildingId/sala=:roomId', roomController.delete)



export default routes;