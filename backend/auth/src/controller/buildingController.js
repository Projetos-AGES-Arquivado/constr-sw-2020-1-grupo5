import admin from '../database/connection';

const db = admin.firestore();


async function getBuildings() {
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
  },

  //INSERE NOVO PRÉDIO NA COLEÇÃO DE PRÉDIOS
  async insert(request, response) {

    try {
      const { campus, totalDeSalas, nomeDoPredio, codigoDoPredio, } = request.body

      const buildingCollection = db.collection('predios')

      let firebaseBuiding = null

      await buildingCollection
        .where('codigoDoPredio', '==', codigoDoPredio)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            firebaseBuiding = res.data()
          })
        })

      if (firebaseBuiding) {
        return response.status(401).send("Prédio com código já existente")
      }

      await buildingCollection.add({
        codigoDoPredio: codigoDoPredio,
        nomeDoPredio: nomeDoPredio,
        campus: campus,
        totalDeSalas: totalDeSalas
      })

      return response.status(200).send({ success: true })

    }

    catch (e) {
      return response.status(500).json({
        error: `Erro ao inserir prédio : ${e}`,
      });
    }

  },

  async update(request, response) {

    try{
      const buildingID = request.params.buildingId

    console.log(request.params.buildingId)

    const { campus, totalDeSalas, nomeDoPredio} = request.body

    console.log(request.body)

    const buildingCollection = db.collection('predios')

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

      if(!building){
        return response.status(404).send(`Nenhum prédio encontrado com o código ${buildingID}`)
      }

      await buildingCollection.doc(building.id).update({
        nomeDoPredio: nomeDoPredio,
        campus: campus,
        totalDeSalas: totalDeSalas
      })

      return response
        .status(200)
        .send({ success: true, msg: 'Prédio atualizado com sucesso' });
    } catch(error){
      return response.status(500).json({
        error: `Erro ao atualizar prédio : ${error}`,
      });
    }
  }
}