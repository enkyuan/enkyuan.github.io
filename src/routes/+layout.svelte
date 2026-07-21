<script lang="ts">
import "../app.css";
import { browser, dev } from "$app/environment";
import { onMount } from "svelte";
import { Agentation } from "sv-agentation";

onMount(() => {
	if (dev) {
		import("react-grab");
	}
});
</script>

{#if browser && dev}
	<Agentation />
{/if}

<main>
	<slot />
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
	}
</style>
