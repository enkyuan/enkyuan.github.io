<script lang="ts">
import Link from "./link.svelte";

interface LinkItem {
	text: string;
	href: string;
}

interface ListItem {
	text: string;
	link_text?: string;
	link_href?: string;
	links?: LinkItem[];
}

const { items, class: className = "" } = $props<{
	items: ListItem[];
	class?: string;
}>();

function processTextWithLinks(
	text: string,
	links: LinkItem[],
): (string | LinkItem)[] {
	const result: (string | LinkItem)[] = [];
	let lastIndex = 0;

	// Sort links by position in text (earliest first)
	const linkPositions = links
		.map((link) => ({
			link,
			index: text.indexOf(link.text),
		}))
		.filter((lp) => lp.index >= 0)
		.sort((a, b) => a.index - b.index);

	for (const { link, index } of linkPositions) {
		// Add text before the link
		if (index > lastIndex) {
			result.push(text.slice(lastIndex, index));
		}
		// Add the link
		result.push(link);
		lastIndex = index + link.text.length;
	}

	// Add remaining text after the last link
	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result.length > 0 ? result : [text];
}
</script>

<ul class="list-disc list-outside space-y-1.5 text-xs md:text-sm text-gray-700 pl-5 {className}">
	{#each items as item}
		<li>
			{#if item.links && item.links.length > 0}
				{@const parts = processTextWithLinks(item.text, item.links)}
				{#each parts as part}
					{#if typeof part === "string"}
						{part}
					{:else}
						<Link href={part.href} text={part.text} />
					{/if}
				{/each}
			{:else if item.link_text && item.link_href}
				{@const linkIndex = item.text.indexOf(item.link_text)}
				{#if linkIndex >= 0}
					{item.text.slice(0, linkIndex)}
					<Link href={item.link_href} text={item.link_text} />
					{item.text.slice(linkIndex + item.link_text.length)}
				{:else}
					{item.text}
					{" "}
					<Link href={item.link_href} text={item.link_text} />
				{/if}
			{:else}
				{item.text}
			{/if}
		</li>
	{/each}
</ul>
