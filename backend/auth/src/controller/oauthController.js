import keycloak from '../keycloack-config/keycloack';

// Exported functions
module.exports = {

    async post(req, res) {
        
        await keycloak.grantManager
            .obtainDirectly(req.body.login, req.body.password)
            .then(grant => {
                res.json(grant).status(200);
            })
            .catch(error => {
                res.send(error).status(401);
            });
    },

    get(req, res) {
        res.send("pong")
    }

}