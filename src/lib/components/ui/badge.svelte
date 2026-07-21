<script lang="ts">
	import type { Snippet } from "svelte";
	import "$lib/styles/badge.css";

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
