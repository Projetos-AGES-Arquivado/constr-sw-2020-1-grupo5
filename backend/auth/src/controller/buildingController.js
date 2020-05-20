import admin from '../database/connection';
import { getTokenFromCode } from 'sucrase/dist/parser/tokenizer';

const db = admin.firestore();


async function getBuildings() {
  const buildingCollection = db.collection('buildings');
  let result = []
  await buildingCollection
    .get()
    .then((snapshot) => {
      return snapshot.forEach((res) => {
        result.push(res.data())
      });
    });
  if (result.length == 0) {
    return [];
  }
  return result;
}


// Exported functions
module.exports = {
  /**
 * @swagger
 * tags:
 *   name: Building
 *   description: Building collection
 */

  /**
   * @swagger
   * /buildings:
   *  get:
   *    tags: [Building]
   *    description: use to request all buildings
   *    responses:
   *      200:
   *        description: A successfull response
   * 
   */
  async getAll(request, response) {
    try {
      const buildings = await getBuildings();
      if (buildings.length == 0) {
        return response.status(404).json({ error: 'No building found' });
      }
      return response.status(200).json(buildings);
    } catch (e) {
      return response.status(500).json({
        error: `Error while searching buildings. Error : ${e}`,
      });
    }
  },

  /**
   * @swagger
   * /buildings/{buildingID}:
   *  get:
   *    tags: [Building]
   *    description: use to request only one building
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      404:
   *        description: Building doesn't exit
   *      500:
   *        description: Error consulting building
   */
  async getOne(request, response) {
    try {
      const buildingID = request.params.buildingID

      const buildingCollection = db.collection('buildings')

      let building = null

      await buildingCollection
        .where('buildingID', '==', buildingID)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            building = res.data()
          })
        })

      if (!building) {
        return response.status(404).send(`Building with code  ${buildingID} not found`)
      }

      return response.status(200).json(building);

    }

    catch (e) {
      return response.status(500).json({
        error: `Error consulting building : ${e}`,
      });
    }

  },

  /**
   * @swagger
   * /buildings:
   *  post:
   *    tags: [Building]
   *    description: use to create a new building
   *    parameters:
   *      - in: body
   *        name: building
   *        schema:
   *          type: object
   *          required:
   *            - campus
   *            - numberOfRooms
   *            - buildingName
   *            - buildingID
   *          properties:
   *            campus: 
   *              type: string
   *            numberOfRooms:
   *              type: integer
   *            buildingName:
   *              type: string
   *            buildingID:
   *              type: string
   *    responses:
   *      201:
   *        description: A successfull response
   *      401:
   *        description: The code already exist
   *      500:
   *        description: Error inserting building
   */
  //INSERE NOVO PRÉDIO NA COLEÇÃO DE PRÉDIOS
  async insert(request, response) {

    try {
      const { campus, numberOfRooms, buildingName, buildingID, } = request.body

      const buildingCollection = db.collection('buildings')

      let firebaseBuiding = null

      await buildingCollection
        .where('buildingID', '==', buildingID)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            firebaseBuiding = res.data()
          })
        })

      if (firebaseBuiding) {
        return response.status(401).send(`Building with code ${buildingID} already exists`)
      }

      const createdBuilding = {
        buildingID: buildingID,
        buildingName: buildingName,
        campus: campus,
        numberOfRooms: numberOfRooms
      }

      await buildingCollection.add(createdBuilding)

      return response.status(201).send({ success: true,
      data: createdBuilding })

    }

    catch (e) {
      return response.status(500).json({
        error: `Error inserting building : ${e}`,
      });
    }

  },

   /**
   * @swagger
   * /buildings/{buildingID}:
   *  put:
   *    tags: [Building]
   *    description: use to update a building
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *      - in: body
   *        name: building
   *        schema:
   *          type: object
   *          required:
   *            - campus
   *            - numberOfRooms
   *            - buildingName
   *          properties:
   *            campus:
   *              type: string
   *            numberOfRooms:
   *              type: integer
   *            buildingName:
   *              type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      404:
   *        description: Not found
   *      500:
   *        description: Error updating building
   */
  async update(request, response) {

    try {
      const buildingID = request.params.buildingID

      const { campus, numberOfRooms, buildingName } = request.body

      const buildingCollection = db.collection('buildings')

      let building = null
      await buildingCollection
        .where('buildingID', '==', buildingID)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            building = {
              id: res.id,
              data: res.data()
            }
          });
        })

      if (!building) {
        return response.status(404).send(`No building found with id ${buildingID}`)
      }

      const updatedBuilding = {
        buildingName: buildingName,
        campus: campus,
        numberOfRooms: numberOfRooms
      }

      await buildingCollection.doc(building.id).update(updatedBuilding)

      return response
        .status(200)
        .send({ 
          success: true, 
          message: 'Building successfully updated', 
          data: updatedBuilding
        });
    } catch (error) {
      return response.status(500).json({
        error: `Error updating building : ${error}`,
      });
    }
  },

  /**
   * @swagger
   * /buildings/{buildingID}:
   *  delete:
   *    tags: [Building]
   *    description: use to delete one building
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *    responses:
   *      204:
   *        description: A successfull response
   *      404:
   *        description: Not found
   *      500:
   *        description: Error removing building
   */
  async delete(request, response) {
    try {
      const buildingID = request.params.buildingID

      const buildingCollection = db.collection('buildings')

      let building = null
      await buildingCollection
        .where('buildingID', '==', buildingID)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            building = {
              id: res.id,
              data: res.data()
            }
          });
        })

      if (!building) {
        return response.status(404).send(`No building found with code ${buildingID}`)
      }

      await buildingCollection.doc(building.id).delete()

      return response
        .status(204)
        .send({ success: true, msg: `Building with ${buildingID} successfully removed` });
    } catch (error) {
      return response.status(500).json({
        error: `Error removing building : ${error}`,
      });
    }
  }
}