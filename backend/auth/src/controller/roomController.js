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
            room = res.data()
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

            console.log(firebaseRoom)

            if (firebaseRoom){
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


    }
}