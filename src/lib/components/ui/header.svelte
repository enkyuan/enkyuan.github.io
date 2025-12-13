<script lang="ts">
import Link from "./link.svelte";

const { name, title, link_href, link_text, class: className = "" } = $props();
</script>

<div class="mb-10 {className}">
	<p class="text-base md:text-base font-medium mb-1.5">{name}</p>
	<div class="flex items-center gap-2 mb-5 justify-between">
		<p class="text-sm md:text-sm text-gray-600">{title}</p>
		{#if link_href && link_text}
			<Link href={link_href} text={link_text} />
		{/if}
	</div>
</div>

