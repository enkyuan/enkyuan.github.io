<script lang="ts">
	import { onMount } from "svelte";
	import {
		countryCodeToFlag,
		createLocationGradient,
		createWorldGrid,
		findLocationCluster,
		formatCoordinate,
		nearestLocation,
		WORLD_GRID_COLUMNS,
		WORLD_GRID_ROWS,
	} from "$lib/location-map";

	type LocationState = "locating" | "located" | "error";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	const US_FLAG_DOTS = Array.from({ length: 12 }, (_, index) => index);
	const US_FLAG_DOT_STEP = 34 / US_FLAG_DOTS.length;
	const US_FLAG_DOT_SIZE = 2.3;
	const US_FLAG_STARS = [
		{ x: 2.2, y: 1.8 },
		{ x: 7.2, y: 1.8 },
		{ x: 12.2, y: 1.8 },
		{ x: 4.7, y: 6.6 },
		{ x: 9.7, y: 6.6 },
		{ x: 2.2, y: 11.4 },
		{ x: 7.2, y: 11.4 },
		{ x: 12.2, y: 11.4 },
	] as const;

	let locationState: LocationState = $state("locating");
	let place = $state("Current location");
	let countryCode = $state("");
	let latitude: number | undefined = $state();
	let longitude: number | undefined = $state();
	let highlightedCells: string[] = $state([]);
	let highlightedCellColors: Map<string, string> = $state(new Map());
	let statusMessage = $state("Finding your current location.");

	onMount(locate);

	function locate() {
		if (!("geolocation" in navigator)) {
			locationState = "error";
			statusMessage = "Location is not available in this browser.";
			return;
		}

		locationState = "locating";
		statusMessage = "Finding your current location.";

		navigator.geolocation.getCurrentPosition(
			(position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				const nearest = nearestLocation(latitude, longitude);
				place = nearest.name;
				countryCode = nearest.countryCode;
				const cluster = findLocationCluster(
					cells,
					latitude,
					longitude,
				);
				highlightedCells = cluster;
				highlightedCellColors = createLocationGradient(cells, cluster);
				locationState = "located";
				statusMessage = `Current location found near ${place}.`;
			},
			(error) => {
				locationState = "error";
				statusMessage =
					error.code === error.PERMISSION_DENIED
						? "Location access was not allowed. You can retry whenever you are ready."
						: "Your location could not be found. Check your connection and try again.";
			},
			{ enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
		);
	}

	function cellStyle(row: number, column: number, color: string | undefined) {
		const delay = Math.min(column * 3 + Math.abs(row - (WORLD_GRID_ROWS - 1) / 2) * 2, 220);
		return `grid-column:${column + 1};grid-row:${row + 1};--cell-delay:${delay}ms;--cell-color:${color ?? "#e7e8ea"}`;
	}

	function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined) {
		if (currentLatitude === undefined || currentLongitude === undefined) return undefined;
		const x = ((currentLongitude + 180) / 360) * 100;
		const y = ((90 - currentLatitude) / 180) * 100;
		return `--anchor-x:${x}%;--anchor-y:${y}%`;
	}

	function flagDotFill(row: number, column: number) {
		if (row < 6 && column < 6) return "#173b84";
		return row % 2 === 0 ? "#b52b3a" : "#f7f8fa";
	}
</script>

<section class:animate class="location-map" aria-labelledby="location-title">
	<div class="map-stage">
		<div
			class="map-grid"
			role="img"
			aria-label={locationState === "located"
				? `Pixel world map highlighting your current location near ${place}`
				: "Pixel world map awaiting your location"}
		>
			{#each cells as cell}
				{@const locationColor = highlightedCellColors.get(cell.id)}
				<span
					class:location-cell={locationColor !== undefined}
					class:location-anchor={cell.id === highlightedCells[0]}
					class="map-cell"
					style={cellStyle(cell.row, cell.column, locationColor)}
					aria-hidden="true"
				></span>
			{/each}
		</div>

		{#key locationState}
			<div
				class:error={locationState === "error"}
				class:located={locationState === "located" && latitude !== undefined && longitude !== undefined}
				class:opens-right={longitude === undefined || longitude < 0}
				class:opens-left={longitude !== undefined && longitude >= 0}
				class:opens-below={latitude === undefined || latitude >= 0}
				class:opens-above={latitude !== undefined && latitude < 0}
				class="location-pill"
				style={pillPosition(latitude, longitude)}
				aria-live="polite"
			>
				{#if locationState === "located" && latitude !== undefined && longitude !== undefined}
					<span class:us={countryCode === "US"} class="country-flag" aria-hidden="true">
						{#if countryCode === "US"}
							<svg viewBox="0 0 34 34" focusable="false">
								<defs>
									<clipPath id="us-flag-circle">
										<circle cx="17" cy="17" r="17" />
									</clipPath>
									<symbol id="us-flag-star" viewBox="0 0 10 10">
										<path d="M5 0.8 6.1 3.7 9.2 3.8 6.8 5.8 7.6 8.9 5 7.2 2.4 8.9 3.2 5.8 0.8 3.8 3.9 3.7Z" />
									</symbol>
								</defs>
								<g clip-path="url(#us-flag-circle)">
									<circle cx="17" cy="17" r="17" fill="#111315" />
									{#each US_FLAG_DOTS as row}
										{#each US_FLAG_DOTS as column}
											<rect
												x={column * US_FLAG_DOT_STEP + (US_FLAG_DOT_STEP - US_FLAG_DOT_SIZE) / 2}
												y={row * US_FLAG_DOT_STEP + (US_FLAG_DOT_STEP - US_FLAG_DOT_SIZE) / 2}
												width={US_FLAG_DOT_SIZE}
												height={US_FLAG_DOT_SIZE}
												rx="0.45"
												fill={flagDotFill(row, column)}
											/>
										{/each}
									{/each}
									{#each US_FLAG_STARS as star}
										<use
											href="#us-flag-star"
											x={star.x}
											y={star.y}
											width="2.5"
											height="2.5"
											fill="#f7f8fa"
										/>
									{/each}
								</g>
							</svg>
						{:else}
							<span class="flag-emoji">{countryCodeToFlag(countryCode)}</span>
						{/if}
					</span>
					<div class="pill-copy">
						<h1 id="location-title">{place}</h1>
						<p class="coordinates">
							{formatCoordinate(latitude, "N", "S", 3)} · {formatCoordinate(longitude, "E", "W", 3)}
						</p>
					</div>
				{:else if locationState === "error"}
					<h1 id="location-title">Location unavailable</h1>
					<button type="button" onclick={locate}>Try again</button>
				{:else}
					<h1 id="location-title">Finding your location…</h1>
				{/if}
			</div>
		{/key}
	</div>
	<p class="sr-only" aria-live="polite">{statusMessage}</p>
</section>

<style>
	.location-map {
		position: relative;
		isolation: isolate;
		padding-top: clamp(2.75rem, 7vh, 4.25rem);
		padding-bottom: 7.5rem;
	}

	.map-stage {
		position: relative;
	}

	.map-grid {
		display: grid;
		grid-template-columns: repeat(64, minmax(0, 1fr));
		grid-template-rows: repeat(32, minmax(0, 1fr));
		gap: clamp(2px, 0.45vw, 3px);
		width: 100%;
		aspect-ratio: 2 / 1;
	}

	.map-cell {
		aspect-ratio: 1;
		border-radius: clamp(1px, 0.24vw, 2px);
		background: var(--cell-color);
		transition: transform 220ms var(--ease-out);
	}

	.animate .map-cell {
		animation: map-cell-enter 300ms var(--ease-out) var(--cell-delay) backwards;
	}

	.map-cell.location-cell {
		transform: scale(1.08);
	}

	.animate .map-cell.location-anchor {
		z-index: 2;
		animation: location-cell-drop 420ms var(--ease-out) 60ms both;
	}

	.location-pill {
		position: absolute;
		z-index: 3;
		display: flex;
		width: fit-content;
		max-width: calc(100% - 1.5rem);
		height: 54px;
		align-items: center;
		gap: 10px;
		bottom: clamp(0.75rem, 3vw, 1.5rem);
		left: clamp(1rem, 7vw, 3.5rem);
		border-radius: 999px;
		padding: 10px 16px 10px 10px;
		background: #111315;
		box-shadow:
			0 1px 2px rgba(5, 11, 24, 0.18),
			0 5px 12px rgba(5, 11, 24, 0.12);
		color: #f7f8fa;
	}

	.location-pill.located {
		top: var(--anchor-y);
		bottom: auto;
		left: var(--anchor-x);
	}

	.location-pill.located.opens-right.opens-below {
		transform: translate(14px, 12px);
	}

	.location-pill.located.opens-left.opens-below {
		transform: translate(calc(-100% - 14px), 12px);
	}

	.location-pill.located.opens-right.opens-above {
		transform: translate(14px, calc(-100% - 12px));
	}

	.location-pill.located.opens-left.opens-above {
		transform: translate(calc(-100% - 14px), calc(-100% - 12px));
	}

	.animate .location-pill {
		animation: pill-enter 300ms var(--ease-out) 180ms backwards;
	}

	.pill-copy {
		min-width: 0;
	}

	.country-flag {
		display: block;
		flex: 0 0 34px;
		width: 34px;
		height: 34px;
		overflow: hidden;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px rgba(247, 248, 250, 0.08);
		transform: translateY(-0.5px);
	}

	.country-flag svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.flag-emoji {
		display: grid;
		width: 100%;
		height: 100%;
		place-items: center;
		font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
		font-size: 2rem;
		line-height: 1;
		transform: scale(1.3);
	}

	.location-pill h1,
	.coordinates {
		margin: 0;
	}

	.location-pill h1 {
		font-family: "Portfolio Rounded", sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.coordinates {
		margin-top: 0.18rem;
		color: rgba(247, 248, 250, 0.62);
		font-size: 0.75rem;
		letter-spacing: -0.01em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.location-pill button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		margin-left: 0.15rem;
		border: 0;
		border-radius: 999px;
		padding: 0.45rem 0.7rem;
		background: #f7f8fa;
		color: #17191d;
		font-family: "Portfolio Rounded", sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: -0.015em;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			transform 140ms var(--ease-out);
	}

	.location-pill button:focus-visible {
		outline: 2px solid #78a2d5;
		outline-offset: 3px;
	}

	.location-pill button:active {
		transform: scale(0.96);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes map-cell-enter {
		from {
			opacity: 0;
			transform: scale(0.72);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes pill-enter {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes location-cell-drop {
		from {
			opacity: 0;
			transform: translateY(-18px) scale(0.92);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1.08);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.location-pill button:hover {
			background: #e7e8ea;
		}
	}

	@media (max-width: 560px) {
		.location-map {
			padding-top: 2.5rem;
			padding-bottom: 4.5rem;
		}

		.location-pill {
			max-width: calc(100% - 1rem);
			bottom: 0.5rem;
			left: 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-cell,
		.map-cell.location-anchor,
		.location-pill,
		.location-pill button {
			animation: none;
			transition-duration: 0ms;
		}
	}
</style>
