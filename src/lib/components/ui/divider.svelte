<script lang="ts">
const {
	show = true,
	pb = "pb-10",
	mb = "mb-10",
	class: className = "",
	children,
} = $props();
</script>

{#if show}
	<div class="divider-dotted {pb} {mb} {className}">
		{@render children()}
	</div>
{:else}
	<div class="{className}">
		{@render children()}
	</div>
{/if}

<style>
	.divider-dotted {
		position: relative;
	}
	
	.divider-dotted::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
		background-size: 8px 2px;
		background-position: 0 0;
		background-repeat: repeat-x;
	}
</style>

