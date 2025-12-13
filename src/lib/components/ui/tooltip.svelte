<script lang="ts">
import { fly, crossfade } from "svelte/transition";
import { onMount } from "svelte";
import { tooltipState } from "$lib/stores/tooltip.svelte";

interface Props {
	text?: string;
	placement?: "right" | "left" | "top" | "bottom" | "auto";
	variant?: "default" | "info" | "warning" | "link-preview";
	disabled?: boolean;
	delay?: number;
	offset?: number;
	arrow?: boolean;
	previewTitle?: string;
	previewDescription?: string;
	previewImage?: string;
	previewUrl?: string;
	content?: import("svelte").Snippet;
	children?: import("svelte").Snippet;
}

const {
	text = "",
	placement = "auto",
	variant = "default",
	disabled = false,
	delay = 200,
	offset = 12,
	arrow = false,
	previewTitle = "",
	previewDescription = "",
	previewImage = "",
	previewUrl = "",
	content,
	children,
}: Props = $props();

let mounted = false;
const tooltipElement: HTMLElement | null = $state(null);
const wrapperElement: HTMLElement | null = null;
let timeoutId: number | null = null;
let computedPlacement: "right" | "left" | "top" | "bottom" = $state("right");
const imageLoaded = $state(false);
const imageFailed = $state(false);

// Generate unique ID for this tooltip instance
const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

// Reactive state: this tooltip should show if it's the active one
const show = $derived(tooltipState.activeTooltip?.id === tooltipId);
const isTransitioning = $derived(tooltipState.isTransitioning);

onMount(() => {
	mounted = true;
	return () => {
		// Clean up if this tooltip is active when unmounted
		if (tooltipState.activeTooltip?.id === tooltipId) {
			tooltipState.clear();
		}
		// Clear any pending timeout
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
	};
});

// Map placement to fly transition direction
const flyConfig = {
	right: { x: -12, y: 0 },
	left: { x: 12, y: 0 },
	top: { x: 0, y: 12 },
	bottom: { x: 0, y: -12 },
};

function calculatePlacement() {
	if (!mounted || !wrapperElement || placement !== "auto") {
		computedPlacement = placement === "auto" ? "top" : placement;
		return;
	}

	const rect = wrapperElement.getBoundingClientRect();
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	// Determine best placement based on available space
	const spaceRight = viewportWidth - rect.right;
	const spaceLeft = rect.left;
	const spaceTop = rect.top;
	const spaceBottom = viewportHeight - rect.bottom;

	// Prioritize top/bottom for better readability, then left/right
	if (spaceTop > 100) {
		computedPlacement = "top";
	} else if (spaceBottom > 100) {
		computedPlacement = "bottom";
	} else if (spaceRight > 150) {
		computedPlacement = "right";
	} else if (spaceLeft > 150) {
		computedPlacement = "left";
	} else {
		computedPlacement = "top"; // fallback
	}
}

function handleMouseEnter() {
	if (disabled) return;

	calculatePlacement();

	// If another tooltip is already active, transition immediately without delay
	const hasActiveTooltip = tooltipState.activeTooltip !== null;

	if (delay > 0 && !hasActiveTooltip) {
		timeoutId = window.setTimeout(() => {
			activateTooltip();
		}, delay);
	} else {
		// No delay needed if switching between tooltips
		activateTooltip();
	}
}

function handleMouseLeave() {
	if (timeoutId !== null) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
	// Only clear if this tooltip is currently active
	if (tooltipState.activeTooltip?.id === tooltipId) {
		tooltipState.clear();
	}
}

function activateTooltip() {
	const rect = wrapperElement?.getBoundingClientRect() || null;
	tooltipState.setActive({
		id: tooltipId,
		text,
		variant,
		previewTitle,
		previewDescription,
		previewImage,
		previewUrl,
		targetRect: rect,
		placement: computedPlacement,
	});
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
    bind:this={wrapperElement}
    class="tooltip-wrapper"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="tooltip"
>
    {#if children}
        {@render children()}
    {/if}
    {#if show}
        <div
            bind:this={tooltipElement}
            class="tooltip {computedPlacement} variant-{variant}"
            class:has-arrow={arrow}
            class:transitioning={isTransitioning}
            transition:fly={{
                ...flyConfig[computedPlacement],
                duration: isTransitioning ? 350 : 280,
                opacity: 0,
                easing: isTransitioning ? (t) => t * (2 - t) : undefined,
            }}
            role="tooltip"
            aria-live="polite"
        >
            {#if arrow}
                <div class="tooltip-arrow {computedPlacement}"></div>
            {/if}
            <div class="tooltip-content">
                {#if variant === "link-preview" && (previewTitle || previewDescription || previewImage)}
                    <div class="link-preview-card">
                        {#if previewImage && !imageFailed}
                            <div class="preview-image-container">
                                <img
                                    src={previewImage}
                                    alt={previewTitle}
                                    class="preview-image"
                                    class:loaded={imageLoaded}
                                    onload={() => (imageLoaded = true)}
                                    onerror={() => (imageFailed = true)}
                                />
                            </div>
                        {/if}
                        <div class="preview-text">
                            {#if previewTitle}
                                <div class="preview-title">{previewTitle}</div>
                            {/if}
                            {#if previewDescription}
                                <div class="preview-description">{previewDescription}</div>
                            {/if}
                            {#if previewUrl}
                                <div class="preview-url">{previewUrl}</div>
                            {/if}
                        </div>
                    </div>
                {:else if content}
                    {@render content()}
                {:else}
                    {text}
                {/if}
            </div>
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
        max-width: 300px;
        border-radius: 8px;
        padding: 0.5em 0.85em;
        font-size: 0.9em;
        font-family: var(--font-body);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        z-index: 1000;
        pointer-events: none;
        opacity: 0.98;
        backdrop-filter: blur(8px);
        will-change: transform, opacity;
    }

    .tooltip.transitioning {
        transition:
            transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            opacity 0.25s ease-out;
    }

    .tooltip-content {
        position: relative;
        z-index: 1;
    }

    .tooltip.transitioning .tooltip-content {
        transition: opacity 0.2s ease-in-out;
    }

    /* Variant Styles */
    .tooltip.variant-default {
        background: var(--orange);
        color: var(--fg);
    }

    .tooltip.variant-info {
        background: var(--diff-change);
        color: var(--fg);
    }

    .tooltip.variant-warning {
        background: var(--yellow);
        color: var(--bg);
    }

    .tooltip.variant-link-preview {
        background: rgba(var(--bg-rgb, 18, 18, 18), 0.95);
        color: var(--fg);
        border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
        padding: 0;
        white-space: normal;
        line-height: 1.5;
        min-width: 280px;
        max-width: 350px;
        overflow: hidden;
    }

    /* Positioning */
    .tooltip.right {
        top: 50%;
        left: calc(100% + 12px);
        transform: translateY(-50%);
    }
    .tooltip.left {
        top: 50%;
        right: calc(100% + 12px);
        transform: translateY(-50%);
    }
    .tooltip.top {
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
    }
    .tooltip.bottom {
        top: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
    }

    /* Arrow Styles */
    .tooltip-arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
    }

    .tooltip.variant-default .tooltip-arrow {
        background: var(--orange);
    }

    .tooltip.variant-info .tooltip-arrow {
        background: var(--diff-change);
    }

    .tooltip.variant-warning .tooltip-arrow {
        background: var(--yellow);
    }

    .tooltip.variant-link-preview .tooltip-arrow {
        background: rgba(var(--bg-rgb, 18, 18, 18), 0.95);
        border-right: 1px solid var(--border, rgba(255, 255, 255, 0.1));
        border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    }

    /* Arrow positioning */
    .tooltip.right .tooltip-arrow {
        left: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
    }

    .tooltip.left .tooltip-arrow {
        right: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
    }

    .tooltip.top .tooltip-arrow {
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
    }

    .tooltip.bottom .tooltip-arrow {
        top: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
    }

    /* Link Preview Card Styles */
    .link-preview-card {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .tooltip.transitioning .link-preview-card {
        transition:
            opacity 0.2s ease-in-out,
            transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .preview-title,
    .preview-description,
    .preview-url {
        transition: opacity 0.2s ease-in-out;
    }

    .preview-image-container {
        width: 100%;
        aspect-ratio: 1.91 / 1;
        overflow: hidden;
        background: var(--visual-select-bg, rgba(255, 255, 255, 0.05));
        position: relative;
    }

    .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .preview-image.loaded {
        opacity: 1;
    }

    .tooltip.transitioning .preview-image {
        transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .preview-text {
        padding: 0.75rem 1rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .preview-title {
        font-weight: 600;
        font-size: 0.95em;
        color: var(--fg);
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .preview-description {
        font-size: 0.85em;
        color: var(--gray6, rgba(255, 255, 255, 0.6));
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .preview-url {
        font-size: 0.75em;
        color: var(--gray5, rgba(255, 255, 255, 0.4));
        margin-top: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: var(--font-mono, monospace);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .tooltip {
            max-width: 200px;
            font-size: 0.85em;
        }

        .tooltip.variant-link-preview {
            min-width: 240px;
            max-width: 280px;
        }

        .preview-text {
            padding: 0.6rem 0.85rem 0.85rem;
        }

        .preview-title {
            font-size: 0.9em;
        }

        .preview-description {
            font-size: 0.8em;
            -webkit-line-clamp: 1;
            line-clamp: 1;
        }
    }

    @media (max-width: 480px) {
        .tooltip.variant-link-preview {
            min-width: 200px;
            max-width: 240px;
        }

        .preview-image-container {
            aspect-ratio: 16 / 9;
        }
    }
</style>
