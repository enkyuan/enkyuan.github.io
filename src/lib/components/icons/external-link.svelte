<script lang="ts">
const {
	size = 16,
	stroke = "currentColor",
	strokeWidth = 2,
	color,
	class: className = "",
} = $props();

// Support both 'color' and 'stroke' props for backward compatibility
const strokeColor = color ?? stroke;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	class={className}
>
	<!-- Icon from coolicons by Kryston Schwarze - https://creativecommons.org/licenses/by/4.0/ -->
	<path
		fill="none"
		stroke={strokeColor}
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={strokeWidth}
		d="M18.365 5.636h-7.071m7.07 0v7.071m0-7.07L5.638 18.363"
	/>
</svg>
