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
        });
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
        
       const room =  await db.collection('predios').doc(building.id)
        .collection('salas')
        if (!room){
            response.status(401).send("No rooms where found")
        } 
        await room.get()
        .then((snapshot) => {
            return snapshot.forEach((res) => {
                const data = res.data()
                result.push({
                    numero: data.numero,
                    capacidade: data.capacidade
                })
            });
        });

        console.log(result)
        response.status(200).send(result)
    }
}