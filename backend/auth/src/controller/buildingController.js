import admin from '../database/connection';

const db = admin.firestore();


async function getBuildings(){
    const buildingCollection = db.collection('predios');
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
    async getAll(request, response) {
      try {
        const buildings = await getBuildings();
        if (buildings.length == 0) {
          return response.status(400).json({ error: 'Nenhum prédio' });
        }
        return response.status(200).json(buildings);
      } catch (e) {
        return response.status(500).json({
          error: `Erro durante o processamento de busca de usuários. Espere um momento e tente novamente! Erro : ${e}`,
        });
      }
    }
}