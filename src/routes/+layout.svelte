<script lang="ts">
import Sidebar from "../lib/components/navigation/sidebar.svelte";
import "../app.css";

export const prerender = true;
</script>

<div class="layout">
	<Sidebar />
	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100vw;
		max-width: 100vw;
		box-sizing: border-box;
	}
</style>
