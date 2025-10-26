<script lang="ts">
export let variant: "default" | "bordered" | "elevated" = "default";
export let padding: "none" | "sm" | "md" | "lg" = "md";
export let hoverable: boolean = false;
</script>

<div class="card {variant} {padding} {hoverable ? 'hoverable' : ''}" {...$$restProps}>
	<slot />
</div>

<style>
	.card {
		background: color-mix(in srgb, var(--gray) 70%, transparent 30%);
		backdrop-filter: blur(8px);
		border-radius: 12px;
		transition:
			background 0.2s,
			box-shadow 0.2s,
			transform 0.2s;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* Variants */
	.card.default {
		border: 1px solid var(--gray1);
	}

	.card.bordered {
		border: 1.5px solid var(--blue-type);
		background: color-mix(in srgb, var(--gray) 60%, transparent 40%);
	}

	.card.elevated {
		border: 1px solid var(--gray1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	/* Padding */
	.card.none {
		padding: 0;
	}

	.card.sm {
		padding: 0.75rem;
	}

	.card.md {
		padding: 1.25rem;
	}

	.card.lg {
		padding: 2rem;
	}

	/* Hoverable */
	.card.hoverable {
		cursor: pointer;
	}

	.card.hoverable:hover {
		background: color-mix(in srgb, var(--gray) 85%, transparent 15%);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
	}

	.card.hoverable:active {
		transform: translateY(0);
	}
</style>
