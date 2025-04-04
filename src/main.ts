import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import keycloak from "./keycloak.ts";

keycloak
	.init({ onLoad: "login-required" })
	.then((authenticated) => {
		if (authenticated) {
			console.log("KEYCLOAK - Authenticated");
			const app = createApp(App);
			app.config.globalProperties.$keycloak = keycloak;
			app.mount("#app");
		} else {
			console.warn("KEYCLOAK - Not authenticated");
		}
	})
	.catch((error) => {
		console.error("Keycloak init failed", error);
	});

// keycloak
// 	.init({
// 		onLoad: "check-sso",
// 		silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
// 	})
// 	.then((authenticated) => {
// 		if (authenticated) {
// 			const app = createApp(App);
// 			app.config.globalProperties.$keycloak = keycloak;
// 			app.mount("#app");
// 		} else {
// 			console.warn("KEYCLOAK - Not authenticated");
// 		}
// 	})
// 	.catch((error) => console.error("Keycloak init failed", error));
