<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
		onclick,
		ariaLabel,
		ariaLive,
		disabled = false,
		title,
		class: className = "",
	} = $props<{
		children: Snippet;
		onclick?: (event: MouseEvent) => void;
		ariaLabel?: string;
		ariaLive?: "off" | "polite" | "assertive";
		disabled?: boolean;
		title?: string;
		class?: string;
	}>();
</script>

{#if onclick}
	<button
		class="badge {className}"
		type="button"
		{onclick}
		aria-label={ariaLabel}
		aria-live={ariaLive}
		{disabled}
		{title}
	>
		{@render children()}
	</button>
{:else}
	<div class="badge {className}" aria-live={ariaLive}>
		{@render children()}
	</div>
{/if}

<style>
	.badge {
		box-sizing: border-box;
		display: inline-flex;
		width: fit-content;
		max-width: 100%;
		min-height: 54px;
		align-items: center;
		gap: 10px;
		border: 0;
		border-radius: 999px;
		padding: 10px 16px 10px 10px;
		background: #111315;
		box-shadow:
			0 1px 2px rgba(5, 11, 24, 0.18),
			0 5px 12px rgba(5, 11, 24, 0.12);
		color: #f7f8fa;
		font: inherit;
		text-align: left;
	}

	button.badge {
		appearance: none;
		cursor: pointer;
		transition:
			background-color 160ms var(--ease-out),
			box-shadow 160ms var(--ease-out),
			transform 160ms var(--ease-out);
	}

	button.badge:disabled {
		cursor: wait;
	}

	button.badge:focus-visible {
		outline: 2px solid rgba(17, 19, 21, 0.34);
		outline-offset: 3px;
	}

	@media (hover: hover) and (pointer: fine) {
		button.badge:hover:not(:disabled) {
			background: #181b1e;
			box-shadow:
				0 2px 4px rgba(5, 11, 24, 0.18),
				0 8px 18px rgba(5, 11, 24, 0.14);
			transform: translateY(-1px);
		}
	}

	button.badge:active:not(:disabled) {
		transform: scale(0.96);
	}

	@media (prefers-reduced-motion: reduce) {
		button.badge {
			transition-duration: 0ms;
		}
	}
</style>
