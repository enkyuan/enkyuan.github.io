<script lang="ts">
const { tags, class: className = "" } = $props<{
	tags: string[];
	class?: string;
}>();
</script>

<div class="flex flex-wrap gap-3 {className}">
	{#each tags as tag}
		<span class="text-xs md:text-sm text-gray-700">{tag}</span>
	{/each}
</div>

