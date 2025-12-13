<script lang="ts">
const { level = 4, text, class: className = "" } = $props();
</script>

{#if level === 1}
	<h1 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h1>
{:else if level === 2}
	<h2 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h2>
{:else if level === 3}
	<h3 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h3>
{:else if level === 4}
	<h4 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h4>
{:else if level === 5}
	<h5 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h5>
{:else}
	<h6 class="font-medium text-sm md:text-sm mb-1 {className}">{text}</h6>
{/if}

