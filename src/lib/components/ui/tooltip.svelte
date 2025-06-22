<script lang="ts">
import { fly } from "svelte/transition";
export let text: string = "";
export let placement: "right" | "left" | "top" | "bottom" = "right";
export let disabled: boolean = false;
let show = false;

// Map placement to fly transition direction
const flyConfig = {
	right: { x: -12, y: 0 },
	left: { x: 12, y: 0 },
	top: { x: 0, y: 12 },
	bottom: { x: 0, y: -12 },
};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    class="tooltip-wrapper"
    on:mouseenter={() => (show = !disabled)}
    on:mouseleave={() => (show = false)}
>
    <slot />
    {#if show}
        <div
            class="tooltip {placement}"
            transition:fly={{
                ...flyConfig[placement],
                duration: 320,
                opacity: 0,
            }}
        >
            {text}
        </div>
    {/if}
</span>

<style>
    .tooltip-wrapper {
        position: relative;
        display: inline-flex;
    }
    .tooltip {
        position: absolute;
        white-space: nowrap;
        background: var(--orange);
        color: var(--fg);
        border-radius: 10px;
        padding: 0.4em 0.8em;
        font-size: 0.95em;
        font-family: var(--font-body);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        z-index: 100;
        pointer-events: none;
        opacity: 0.98;
    }
    .tooltip.right {
        top: 50%;
        left: 110%;
        transform: translateY(-50%);
    }
    .tooltip.left {
        top: 50%;
        right: 110%;
        transform: translateY(-50%);
    }
    .tooltip.top {
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
    }
    .tooltip.bottom {
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
