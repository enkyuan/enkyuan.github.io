<script lang="ts">
import ExternalLink from "../icons/external-link.svelte";

const {
	href,
	text,
	external,
	class: className = "",
}: {
	href: string;
	text: string;
	external?: boolean;
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
	<span class="text-black/20 group-hover:text-black transition-colors duration-100">
		<ExternalLink size={16} stroke="currentColor" color="currentColor" />
	</span>
</a>

