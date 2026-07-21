<script lang="ts">
import "$lib/styles/card.css";

export const variant: "default" | "bordered" | "elevated" = "default";
export const padding: "none" | "sm" | "md" | "lg" = "md";
export const hoverable = false;
</script>

<div class="card {variant} {padding} {hoverable ? 'hoverable' : ''}" {...$$restProps}>
	<slot />
</div>
