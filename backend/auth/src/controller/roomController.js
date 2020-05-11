import admin from '../database/connection';

const db = admin.firestore();

async function getBuilding(buildingID) {
    const buildingCollection = db.collection('predios');
    let building = null
    await buildingCollection
        .where('codigoDoPredio', '==', buildingID)
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
        .where('numeroDaSala', '==', roomNumber)
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
    async getAll(request, response) {
        const buildingID = request.params.buildingId;
        const building = await getBuilding(buildingID)
        const result = []
        if (!building) {
            return response.status(400).send(`Nenhum prédio encontrado com a id ${buildingID}`)
        }
        await db.collection('predios').doc(building.id)
            .collection('salas')
            .get()
            .then((snapshot) => {
                return snapshot.forEach((res) => {
                    const data = res.data()
                    result.push({
                        numeroDaSala: data.numeroDaSala,
                        tipoDeSala: data.tipoDeSala,
                        capacidadeDeAlunos: data.capacidadeDeAlunos
                    })
                });
            })
            .catch((error) => {
                return response.status.status(500).json({
                    error: `Erro ao verificar salas : ${e}`,
                });
            });

        response.status(200).send(result)
    },

    async getOne(request, response) {

        try {
            const buildingID = request.params.buildingId;
            const roomID = request.params.roomId;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(400).send(`Nenhum prédio encontrado com o id ${buildingID}`)
            }

            const collection = await await db.collection('predios').doc(building.id)
                .collection('salas')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                return response.status(404).send(`Sala com número ${numeroDaSala} não existe`)
            }

            response.status(200).send(firebaseRoom.data)

            return response.status(200).send({ success: true });

        } catch (e) {
            return response.status(500).json({
                error: `Erro ao inserir sala : ${e}`,
            });
        }

    },

    async insert(request, response) {

        try {
            const buildingID = request.params.buildingId;
            const { numeroDaSala, tipoDeSala, capacidadeDeAlunos } = request.body;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(400).send(`Nenhum prédio encontrado com o id ${buildingID}`)
            }

            const collection = await await db.collection('predios').doc(building.id)
                .collection('salas')

            const firebaseRoom = await getRoom(collection, numeroDaSala)

            if (firebaseRoom) {
                return response.status(401).send(`Sala com número ${numeroDaSala} já existente`)
            }

            collection
                .add({
                    numeroDaSala: numeroDaSala,
                    tipoDeSala: tipoDeSala,
                    capacidadeDeAlunos: capacidadeDeAlunos

                })

            return response.status(200).send({ success: true });

        } catch (e) {
            return response.status(500).json({
                error: `Erro ao inserir sala : ${e}`,
            });
        }


    },

    async update(request, response) {
        try {
            const buildingID = request.params.buildingId;
            const roomID = request.params.roomId;
            const { tipoDeSala, capacidadeDeAlunos } = request.body;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`Nenhum prédio encontrado com o id ${buildingID}`)
            }

            const collection = await await db.collection('predios').doc(building.id)
                .collection('salas')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                response.status(404).send(`Nenhuma sala encontrada com o número ${roomID}`);
            }

            collection.doc(firebaseRoom.id).update({
                tipoDeSala: tipoDeSala,
                capacidadeDeAlunos: capacidadeDeAlunos
            })

            return response
                .status(200)
                .send({ success: true, msg: 'Sala atualizada com sucesso' });


        } catch (error) {
            return response.status(500).json({
                error: `Erro ao atualizar sala : ${error}`,
            });
        }
    },

    async delete(request, response) {

        try {
            const buildingID = request.params.buildingId;
            const roomID = request.params.roomId;

            const building = await getBuilding(buildingID);

            if (!building) {
                return response.status(404).send(`Nenhum prédio encontrado com o id ${buildingID}`)
            }

            const collection = await await db.collection('predios').doc(building.id)
                .collection('salas')

            const firebaseRoom = await getRoom(collection, roomID)

            if (!firebaseRoom) {
                response.status(404).send(`Nenhuma sala encontrada com o número ${roomID}`);
            }

            collection.doc(firebaseRoom.id).delete()

            return response
                .status(200)
                .send({ success: true, msg: `Sala ${roomID} removida com sucesso` });

        } catch (error) {
            return response.status(500).json({
                error: `Erro ao remover sala: ${error}`,
            });
        }

    }
}