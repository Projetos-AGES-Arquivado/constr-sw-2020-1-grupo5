import admin from '../database/connection';

const db = admin.firestore();


async function getBuildings(){
    const buildingCollection = db.collection('predios');
    let building = null;
    await buildingCollection
      .get()
      .then((snapshot) => {
        return snapshot.forEach((res) => {
          building = {
            id: res.id,
            data: res.data(),
          };
        });
      });
    if (!building) {
      return null;
    }
    return building;
}


// Exported functions
module.exports = {
    async get(request, response) {
      try {
        const building = await getBuildings();
        if (!building) {
          return response.status(400).json({ error: 'Nenhum usuário' });
        }
        return response.status(200).json(building.data);
      } catch (e) {
        return response.status(500).json({
          error: `Erro durante o processamento de busca de usuários. Espere um momento e tente novamente! Erro : ${e}`,
        });
      }
    }
}