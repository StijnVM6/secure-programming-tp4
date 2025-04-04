import Keycloak from "keycloak-js";

// Initialize Keycloak instance with Keycloak server details
const keycloak = new Keycloak({
	url: "http://localhost:8080",
	realm: "snake",
	clientId: "snake-app",
});

export default keycloak;
