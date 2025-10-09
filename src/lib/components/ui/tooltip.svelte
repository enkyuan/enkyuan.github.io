<script lang="ts">
import { tooltipStore } from "$lib/stores/tooltip";

export let text: string = "";
export let placement: "right" | "left" | "top" | "bottom" = "right";
export let disabled: boolean = false;

let element: HTMLElement;

function handleMouseEnter() {
	if (disabled || !element) return;
	const rect = element.getBoundingClientRect();
	tooltipStore.show(text, placement, rect);
}

function handleMouseLeave() {
	if (disabled) return;
	tooltipStore.hide();
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    bind:this={element}
    class="tooltip-wrapper"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
>
    <slot />
</span>

<style>
    .tooltip-wrapper {
        position: relative;
        display: inline-flex;
    }
</style>
