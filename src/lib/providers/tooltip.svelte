<script lang="ts">
import { tooltipStore } from "$lib/stores/tooltip";
import { fly } from "svelte/transition";

$: placement = $tooltipStore.placement;
$: x = $tooltipStore.x;
$: y = $tooltipStore.y;

// Calculate transform based on placement
$: transform = {
	right: "translateY(-50%)",
	left: "translate(-100%, -50%)",
	top: "translate(-50%, -100%)",
	bottom: "translateX(-50%)",
}[placement];

// Fly direction for initial tooltip appearance
const flyConfig = {
	right: { x: -12, y: 0 },
	left: { x: 12, y: 0 },
	top: { x: 0, y: 12 },
	bottom: { x: 0, y: -12 },
};
</script>

{#if $tooltipStore.visible}
    <div
        class="tooltip-portal"
        style="left: {x}px; top: {y}px; transform: {transform};"
        transition:fly={{
            ...flyConfig[placement],
            duration: 320,
            opacity: 0,
        }}
    >
        {#key $tooltipStore.text}
            <span class="tooltip-text" in:fly={{ y: -4, duration: 200 }}>
                {$tooltipStore.text}
            </span>
        {/key}
    </div>
{/if}

<style>
    .tooltip-portal {
        position: fixed;
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
        transition: all 0.2s ease-out;
    }
    .tooltip-text {
        display: inline-block;
    }
</style>
