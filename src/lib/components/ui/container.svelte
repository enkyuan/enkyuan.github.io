<script lang="ts">
const { class: className = "", children } = $props();
</script>

<div class="min-h-screen bg-white text-black">
	<div class="max-w-2xl mx-auto px-6 py-12 md:py-16 {className}">
		{@render children()}
	</div>
</div>

