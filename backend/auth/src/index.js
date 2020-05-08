const express = require('express');
var bodyParser = require('body-parser');
var Keycloak = require('keycloak-connect');
const admin = require('./database/connection');

const db = admin.firestore();

const kcConfig = {
    "realm": "Homolog",
    "auth-server-url": "http://host.docker.internal:8080/auth",
    "ssl-required": "external",
    "resource": "Homolog-Client",
    "public-client": true,
    "confidential-port": 0
};

const keycloak = new Keycloak({}, kcConfig);
keycloak.redirectToLogin = () => false;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(keycloak.middleware());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.post('/login', (req, res) => {
  keycloak.grantManager
    .obtainDirectly(req.body.login, req.body.password)
    .then(grant => {
      res.json(grant).status(200);
    })
    .catch(error => {
      res.send(error).status(401);
    });
});

app.get('/buildings', (req, res) => {
  try {
    const buildingCollection = db.collection('predios');
    const results = [];

    buildingCollection
    .get()
    .then((snapshot) => {
      return snapshot.forEach((res) => {
        results.push(res.data());
      });
    });
    res.status(200).json(results);
  } catch (e) {
    return response.status(500).json({
      error: `Erro durante o processamento de busca de mentorias. Espere um momento e tente novamente! Erro : ${e}`,
    });
  }
})

module.exports.start = port =>
  app.listen(port, () => console.log(`Listening on port ${port}`));
