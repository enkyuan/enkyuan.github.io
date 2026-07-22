<script lang="ts">
	import {
		DOT_FIELD_DOTS,
		DOT_FIELD_RADIUS,
		DOT_FIELD_STEP,
		isCircularDotVisible,
	} from "$lib/constants/dot-field";

	let { countryCode, size = 34 } = $props<{ countryCode: string; size?: number }>();

	const STARS = new Set(["1-3", "1-5", "3-1", "3-3", "3-5", "5-1", "5-3", "5-5"]);
	const code = $derived(countryCode.trim().toUpperCase());
	const patternId = $derived(`flag-dots-${/^[A-Z]{2}$/.test(code) ? code.toLowerCase() : "generic"}`);
	const emoji = $derived(
		/^[A-Z]{2}$/.test(code)
			? String.fromCodePoint(...[...code].map((character) => 127397 + character.charCodeAt(0)))
			: "🌐",
	);

	function usColor(row: number, column: number) {
		if (row < 7 && column < 7) {
			return STARS.has(`${row}-${column}`)
				? "oklch(0.979 0.003 264.542)"
				: "oklch(0.373 0.13 262.31)";
		}
		return row % 2 === 0
			? "oklch(0.513 0.173 20.342)"
			: "oklch(0.979 0.003 264.542)";
	}
</script>

<span class="country-flag" style={`--flag-size:${size}px`} role="img" aria-label={`${code} flag`}>
	{#if code === "US"}
		<svg viewBox="0 0 34 34" focusable="false">
			{#each DOT_FIELD_DOTS as row}
				{#each DOT_FIELD_DOTS as column}
					{#if isCircularDotVisible(row, column)}
						<circle
							cx={column * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
							cy={row * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
							r={DOT_FIELD_RADIUS}
							fill={usColor(row, column)}
						/>
					{/if}
				{/each}
			{/each}
		</svg>
	{:else}
		<svg viewBox="0 0 34 34" focusable="false">
			<defs>
				<pattern id={patternId} patternUnits="userSpaceOnUse" width="34" height="34">
					<foreignObject width="34" height="34">
						<div class="emoji" xmlns="http://www.w3.org/1999/xhtml">{emoji}</div>
					</foreignObject>
				</pattern>
			</defs>
			{#each DOT_FIELD_DOTS as row}
				{#each DOT_FIELD_DOTS as column}
					{#if isCircularDotVisible(row, column)}
						<circle
							cx={column * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
							cy={row * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
							r={DOT_FIELD_RADIUS}
							fill={`url(#${patternId})`}
						/>
					{/if}
				{/each}
			{/each}
		</svg>
	{/if}
</span>

<style>
	.country-flag {
		display: block;
		flex: 0 0 var(--flag-size);
		width: var(--flag-size);
		height: var(--flag-size);
		overflow: hidden;
		border-radius: 50%;
		transform: translateY(-0.5px);
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.emoji {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
		font-size: 32px;
		line-height: 1;
		transform: scale(1.16);
	}
</style>
