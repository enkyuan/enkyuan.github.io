<script lang="ts">
import "../app.css";
import { onMount } from "svelte";
import { dev } from "$app/environment";

onMount(() => {
	if (dev) {
		import("react-grab");
	}
});
</script>

<main>
	<slot />
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
	}
</style>
