<script setup lang="ts">
import { ref } from "vue";
import SnakeGame from "./components/SnakeGame.vue";
import keycloak from "./keycloak.ts";

const username = ref(keycloak.tokenParsed?.preferred_username || "Guest");

const logout = () => {
	keycloak.logout();
};
</script>

<template>
	<div class="game-wrapper">
		<div class="user-info">
			<p>
				Welcome, <strong>{{ username }}</strong
				>!
			</p>
			<button @click="logout">Logout</button>
		</div>
		<h1>SNAKE '90</h1>
		<SnakeGame />
	</div>
</template>

<style>
.game-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	background-color: #c3c3c3;
	min-height: 100vh;
	padding: 20px;
}

h1 {
	font-family: "Courier New", Courier, monospace;
	color: #2d2d2d;
	text-shadow: 3px 3px #9ba657;
	margin: 0;
}
</style>
