import admin from '../database/connection';

const db = admin.firestore();

async function getBuilding(buildingID) {
    const buildingCollection = db.collection('predios');
    let building = null
    await buildingCollection
        .where('codigo', '==', buildingID)
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


// Exported functions
module.exports = {
    async getAll(request, response) {
        const buildingID = request.params.buildingId;
        const building = await getBuilding(buildingID)
        const result = []
        if(!building){
            return response.status(400).send("No rooms found")
        }
        await db.collection('predios').doc(building.id)
        .collection('salas')
        .get()
        .then((snapshot) => {
            return snapshot.forEach((res) => {
                const data = res.data()
                result.push({
                    numero: data.numero,
                    capacidade: data.capacidade
                })
            });
        })
        .catch( (error) => {
            return response.status.status(500).json({
                error: `Erro ao verificar salas : ${e}`,
              });
        });

        console.log(result)
        response.status(200).send(result)
    }
}