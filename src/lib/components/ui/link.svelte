<script lang="ts">
import ExternalLink from "../icons/external-link.svelte";

const {
	href,
	text,
	external,
	iconSize,
	class: className = "",
}: {
	href: string;
	text: string;
	external?: boolean;
	iconSize?: number | "responsive";
	class?: string;
} = $props();

const isExternal = $derived(
	external !== undefined
		? external
		: href.startsWith("http://") ||
				href.startsWith("https://") ||
				href.startsWith("//"),
);
</script>

<a
    {href}
    target={isExternal ? "_blank" : undefined}
    rel={isExternal ? "noopener noreferrer" : undefined}
    class="group inline-flex items-center gap-1 text-black text-inherit underline-offset-2 underline decoration-black/20 hover:decoration-black transition-colors duration-100 {className}"
>
	{text}
	<span class="text-black/20 group-hover:text-black transition-colors duration-100 inline-flex items-center {iconSize === 'responsive' ? 'w-3 h-3 md:w-3.5 md:h-3.5' : ''}">
		{#if iconSize === 'responsive'}
			<ExternalLink size={12} stroke="currentColor" color="currentColor" class="w-full h-full" />
		{:else}
			<ExternalLink size={iconSize ?? 16} stroke="currentColor" color="currentColor" />
		{/if}
	</span>
</a>
