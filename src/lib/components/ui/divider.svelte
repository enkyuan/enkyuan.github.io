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
	<div class="border-b-2 border-dotted border-gray-200 {pb} {mb} {className}">
		{@render children()}
	</div>
{:else}
	<div class="{className}">
		{@render children()}
	</div>
{/if}

