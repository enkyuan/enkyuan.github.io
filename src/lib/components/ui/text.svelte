<script lang="ts">
const {
	text,
	size = "xs",
	color = "gray-700",
	mb = "",
	class: className = "",
} = $props();

const sizeClass = $derived(
	size === "sm" ? "text-sm" : size === "base" ? "text-base" : "text-xs",
);

const colorClass = $derived(
	color === "gray-600" ? "text-gray-600" : "text-gray-700",
);
</script>

<p class="{sizeClass} md:text-sm {colorClass} {mb} {className}">
	{text}
</p>

