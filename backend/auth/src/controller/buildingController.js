import admin from '../database/connection';
import { getTokenFromCode } from 'sucrase/dist/parser/tokenizer';

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
        return response.status(400).json({ error: 'Nenhum prédio' });
      }
      return response.status(200).json(buildings);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de usuários. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  /**
   * @swagger
   * /building={buildingId}:
   *  get:
   *    tags: [Building]
   *    description: use to request only one building
   *    parameters:
   *      - in: path
   *        name: buildingId
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      401:
   *        description: Building doesn't exit
   *      500:
   *        description: Error consulting building
   */
  async getOne(request, response) {
    try {
      const buildingID = request.params.buildingId

      const buildingCollection = db.collection('predios')

      let building = null

      await buildingCollection
        .where('codigoDoPredio', '==', buildingID)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((res) => {
            building = res.data()
          })
        })

      if (!building) {
        return response.status(401).send(`Prédio com código ${buildingID} não existe`)
      }

      return response.status(200).json(building);

    }

    catch (e) {
      return response.status(500).json({
        error: `Erro ao consultar prédio : ${e}`,
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

    try {
      const buildingID = request.params.buildingId

      const { campus, totalDeSalas, nomeDoPredio } = request.body

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

      if (!building) {
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
    } catch (error) {
      return response.status(500).json({
        error: `Erro ao atualizar prédio : ${error}`,
      });
    }
  },

  /**
   * @swagger
   * /building={buildingId}:
   *  delete:
   *    tags: [Building]
   *    description: use to delete one building
   *    parameters:
   *      - in: path
   *        name: buildingId
   *        required: true
   *        type: string
   *    responses:
   *      200:
   *        description: A successfull response
   *      404:
   *        description: There is no building with this code
   *      500:
   *        description: Error removing building
   */
  async delete(request, response) {
    try {
      const buildingID = request.params.buildingId

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

      if (!building) {
        return response.status(404).send(`Nenhum prédio encontrado com o código ${buildingID}`)
      }

      await buildingCollection.doc(building.id).delete()

      return response
        .status(200)
        .send({ success: true, msg: `Prédio ${buildingID} removido com sucesso` });
    } catch (error) {
      return response.status(500).json({
        error: `Erro ao remover prédio : ${error}`,
      });
    }
  }
}