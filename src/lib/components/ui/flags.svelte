<script lang="ts">
	let { countryCode, size = 34 } = $props<{ countryCode: string; size?: number }>();

	const GRID = 12;
	const DOTS = Array.from({ length: GRID }, (_, index) => index);
	const STEP = 34 / GRID;
	const STARS = new Set(["1-1", "1-3", "1-5", "3-2", "3-4", "5-1", "5-3", "5-5"]);
	const code = $derived(countryCode.trim().toUpperCase());
	const emoji = $derived(
		/^[A-Z]{2}$/.test(code)
			? String.fromCodePoint(...[...code].map((character) => 127397 + character.charCodeAt(0)))
			: "🌐",
	);

	function isVisible(row: number, column: number) {
		const center = (GRID - 1) / 2;
		return (column - center) ** 2 + (row - center) ** 2 <= 31;
	}

	function usColor(row: number, column: number) {
		if (row < 6 && column < 6) return STARS.has(`${row}-${column}`) ? "#f7f8fa" : "#173b84";
		return row % 2 === 0 ? "#b52b3a" : "#f7f8fa";
	}
</script>

<span class="country-flag" style={`--flag-size:${size}px`} role="img" aria-label={`${code} flag`}>
	{#if code === "US"}
		<svg viewBox="0 0 34 34" focusable="false">
			{#each DOTS as row}
				{#each DOTS as column}
					{#if isVisible(row, column)}
						<circle
							cx={column * STEP + STEP / 2}
							cy={row * STEP + STEP / 2}
							r="1.15"
							fill={usColor(row, column)}
						/>
					{/if}
				{/each}
			{/each}
		</svg>
	{:else}
		<span class="emoji">{emoji}</span>
	{/if}
</span>

<style>
	.country-flag {
		display: block;
		flex: 0 0 var(--flag-size);
		width: var(--flag-size);
		height: var(--flag-size);
		transform: translateY(-0.5px);
	}

	svg,
	.emoji {
		display: block;
		width: 100%;
		height: 100%;
	}

	.emoji {
		font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
		font-size: var(--flag-size);
		line-height: 1;
	}
</style>
