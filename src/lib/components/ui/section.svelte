<script lang="ts">
const {
	title,
	mb = "mb-12",
	class: className = "",
	children,
}: {
	title?: string;
	mb?: string;
	class?: string;
	children?: import("svelte").Snippet;
} = $props();
</script>

<section class="{mb} {className}">
	{#if title}
		<h2 class="text-sm md:text-sm font-semibold mb-4">{title}</h2>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</section>

