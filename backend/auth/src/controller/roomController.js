import admin from '../database/connection';

const db = admin.firestore();

async function getBuilding(buildingID) {
    const buildingCollection = db.collection('buildings');
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
        return null;
    }
    return building;
}

async function getRoom(collection, roomNumber) {

    let room = null

    await collection
        .where('roomNumber', '==', roomNumber)
        .get()
        .then((snapshot) => {
            return snapshot.forEach((res) => {
                room = {
                    id: res.id,
                    data: res.data()
                }
            })
        })

    return room
}


// Exported functions

module.exports = {
    /**
 * @swagger
 * tags:
 *   name: Room
 *   description: Room collection
 */
    /**
   * @swagger
   * /buildings/{buildingID}/rooms:
   *  get:
   *    tags: [Room]
   *    description: use to request all rooms
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      400:
   *        description: Room not founded
   *      500:
   *        description: Error consulting room
   */
    async getAll(request, response) {
        const buildingID = request.params.buildingID;
        const building = await getBuilding(buildingID)
        const result = []
        if (!building) {
            return response.status(404).send(`No room found with id ${buildingID}`)
        }
        await db.collection('buildings').doc(building.id)
            .collection('rooms')
            .get()
            .then((snapshot) => {
                return snapshot.forEach((res) => {
                    const data = res.data()
                    result.push({
                        roomNumber: data.roomNumber,
                        roomType: data.roomType,
                        roomCapacity: data.roomCapacity
                    })
                });
            })
            .catch((error) => {
                return response.status.status(500).json({
                    error: `Error geting rooms : ${e}`,
                });
            });

        response.status(200).send(result)
    },

    /**
   * @swagger
   * /buildings/{buildingID}/rooms/{roomID}:
   *  get:
   *    tags: [Room]
   *    description: use to request only one room
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *      - in: path
   *        name: roomID
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      400:
   *        description: There is no building with this Id
   *      404:
   *        description: No exist room with this number
   */
    async getOne(request, response) {

        try {
            const buildingID = request.params.buildingID;
            const roomID = request.params.roomID;
            console.log(roomID)
            console.log(buildingID)

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`No building found with id ${buildingID}`)
            }

            const collection = await await db.collection('buildings').doc(building.id)
                .collection('rooms')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                return response.status(404).send(`Room with number ${roomNumber} not found`)
            }

            response.status(200).send(firebaseRoom.data)

            return response.status(200).send({ success: true });

        } catch (e) {
            return response.status(500).json({
                error: `Error inserting room : ${e}`,
            });
        }

    },

    /**
   * @swagger
   * /buildings/{buildingID}/rooms:
   *  post:
   *    tags: [Room]
   *    description: use to create a new room
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *      - in: body
   *        name: room
   *        schema:
   *          type: object
   *          required:
   *            - roomNumber
   *            - roomType
   *            - roomCapacity
   *          properties:
   *            roomNumber: 
   *              type: string
   *            roomType:
   *              type: string
   *            roomCapacity:
   *              type: integer
   *    responses:
   *      200:
   *        description: A successfull response
   *      400:
   *        description: There is no building with this Id
   *      401:
   *        description: Already exist a room with this number
   *      500:
   *        description: Error inserting room
   */
    async insert(request, response) {

        try {
            const buildingID = request.params.buildingID;
            const { roomNumber, roomType, roomCapacity } = request.body;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`No building found with id ${buildingID}`)
            }

            const collection = await await db.collection('buildings').doc(building.id)
                .collection('rooms')

            const firebaseRoom = await getRoom(collection, roomNumber)

            if (firebaseRoom) {
                return response.status(401).send(`Room with number ${roomNumber} already exists`)
            }

            const newRoom = {
                roomNumber: roomNumber,
                    roomType: roomType,
                    roomCapacity: roomCapacity
            }

            collection
                .add(newRoom)

            return response.status(201).send({ 
                success: true,
                data: newRoom
             });

        } catch (e) {
            return response.status(500).json({
                error: `Error inserting room : ${e}`,
            });
        }


    },

    /**
   * @swagger
   * /buildings/{buildingID}/rooms/{roomID}:
   *  put:
   *    tags: [Room]
   *    description: use to update a room
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *      - in: path
   *        name: roomID
   *        required: true
   *        type: string
   *      - in: body
   *        name: room
   *        schema:
   *          type: object
   *          required:
   *            - roomType
   *            - roomCapacity
   *          properties:
   *            roomType:
   *              type: string
   *            roomCapacity:
   *              type: integer
   *    responses:
   *      200:
   *        description: A successfull response
   *      401:
   *        description: There is no room with this Id
   *      404:
   *        description: There is no building with this Id
   *      500:
   *        description: Error updating room
   */
    async update(request, response) {
        try {
            const buildingID = request.params.buildingID;
            const roomID = request.params.roomID;
            const { roomType, roomCapacity } = request.body;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`No building found with id ${buildingID}`)
            }

            const collection = await await db.collection('buildings').doc(building.id)
                .collection('rooms')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                response.status(404).send(`No room found with id ${roomID}`);
            }

            const updatedRoom = {
                roomNumber: buildingID,
                roomType: roomType,
                roomCapacity: roomCapacity
            }

            collection.doc(firebaseRoom.id).update({
                roomType: roomType,
                roomCapacity: roomCapacity
            })

            return response
                .status(200)
                .send({ 
                    success: true, 
                    message: 'Room successfully updated',
                    data: updatedRoom
             });


        } catch (error) {
            return response.status(500).json({
                error: `Error updating room : ${error}`,
            });
        }
    },

    /**
   * @swagger
   * /buildings/{buildingID}/rooms/{roomID}:
   *  delete:
   *    tags: [Room]
   *    description: use to delete one room
   *    parameters:
   *      - in: path
   *        name: buildingID
   *        required: true
   *        type: string
   *      - in: path
   *        name: roomID
   *        required: true
   *        type: string
   *    responses:
   *      204:
   *        description: A successfull response
   *      404:
   *        description: There is no room with this number
   *      500:
   *        description: Error removing room
   */
    async delete(request, response) {

        try {
            const buildingID = request.params.buildingID;
            const roomID = request.params.roomID;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`No building found with id ${buildingID}`)
            }

            const collection = await await db.collection('buildings').doc(building.id)
                .collection('rooms')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                response.status(404).send(`No room found with number ${roomID}`);
            }

            collection.doc(firebaseRoom.id).delete()

            return response
                .status(204)
                .send({ success: true, message: `Room ${roomID} successfully removed` });

        } catch (error) {
            return response.status(500).json({
                error: `Error removing room: ${error}`,
            });
        }

    }
}