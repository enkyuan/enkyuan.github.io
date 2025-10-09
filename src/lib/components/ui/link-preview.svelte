<script lang="ts">
import { linkPreviewStore } from "$lib/stores/link-preview.svelte";

export let href: string;
export let placement: "top" | "bottom" | "left" | "right" = "top";
export let delay: number = 500;
export let disabled: boolean = false;

let element: HTMLElement;

function handleMouseEnter() {
	if (disabled || !element || !href) return;

	// Validate URL before showing preview
	try {
		new URL(href);
	} catch {
		return; // Invalid URL, don't show preview
	}

	const rect = element.getBoundingClientRect();
	linkPreviewStore.show(href, placement, rect, delay);
}

function handleMouseLeave() {
	if (disabled) return;
	linkPreviewStore.hide();
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    bind:this={element}
    class="link-preview-wrapper"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
>
    <slot />
</span>

<style>
    .link-preview-wrapper {
        position: relative;
        display: inline;
    }
</style>
