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
    // Vite emits same-origin SVG assets. No emoji font or third-party request
    // is needed at runtime, including on Windows without flag emoji glyphs.
    const flagAssets = import.meta.glob<string>(
      "/node_modules/country-flag-icons/1x1/*.svg",
      { eager: true, query: "?url&no-inline", import: "default" },
    );
    const source = $derived(flagAssets[`/node_modules/country-flag-icons/1x1/${code}.svg`]);
    let failedSource = $state<string>();
    const dots = DOT_FIELD_DOTS.flatMap(row => DOT_FIELD_DOTS
      .filter(column => isCircularDotVisible(row, column))
      .map(column => `<circle cx="${column * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}" cy="${row * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}" r="${DOT_FIELD_RADIUS}" fill="white"/>`)).join("");
    const dotMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34">${dots}</svg>`)}")`;

	function usColor(row: number, column: number) {
		if (row < 7 && column < 7) {
			return STARS.has(`${row}-${column}`)
				? "oklch(1 0 0)"
				: "oklch(0.545 0.244 262.398)";
		}
		return row % 2 === 0
			? "oklch(0.513 0.173 20.342)"
			: "oklch(1 0 0)";
	}
</script>

<span class="country-flag" style={`--flag-size:${size}px;--flag-mask:${dotMask}`} role="img" aria-label={source || code === "US" ? `${code} flag` : "Current location"}>
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
    {:else if source && failedSource !== source}
      <img src={source} alt="" width={size} height={size}
        onerror={() => { failedSource = source; }} />
    {:else}
      <span class="fallback" aria-hidden="true">{(/^[A-Z]{2}$/.test(code)) ? code : "?"}</span>
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

	svg {
		display: block;
		width: 100%;
		height: 100%;
	}

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      -webkit-mask-image: var(--flag-mask);
      mask-image: var(--flag-mask);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
    }

    .fallback {
      display: grid;
      height: 100%;
      place-items: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
</style>
