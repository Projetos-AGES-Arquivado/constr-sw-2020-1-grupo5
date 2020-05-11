import Keycloak from 'keycloak-connect';

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

export default keycloak;
